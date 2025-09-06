import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { User } from 'src/app/core/models/User';
import { ExcelService } from 'src/app/core/services/excel.service';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { InventoryService } from '../../services/inventory.service';
import { HistoryInventory } from 'src/app/core/models/HistoryInventory';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../../../assets/css/HomeModules.css']
})
export class HomeComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const sidebar = document.getElementById('sidebar');
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    if (screenWidth < 768) {
      sidebar?.classList.add('hide');
    } else {
      sidebar?.classList.remove('hide');
    }
  }

  items:MenuItem[] = [
    {
        label: 'Agregar Inventario',
        // icon: 'pi pi-plus',
        icon: 'bx bxs-folder-plus',
        routerLink: ['/history/create'],
    },
    {
      label: 'Facturas',
      icon: 'pi pi-book',
      routerLink: ['/history/bills'],
    },
    {
        label: 'Descargar Excel',
        icon: 'pi pi-file-excel',
        command: () => {
            this.downloadExcel();
        }
    }
    
  ];

  //lazy load

  totalRecords!: number;
  loading: boolean = false;
  selectAll: boolean = false;
  public lazy = true;

  //** lazyload */

  public formViewInventory: FormGroup;

  histories: HistoryInventory[];

  total: number;

  history: HistoryInventory;

  selectedSize = 'p-datatable-sm';

  img:any;
  userLocalStorage:User;
  visibleDialog: boolean = false;
  visibleConfirm: boolean = false;

  constructor(
    private fb: FormBuilder,
    public  storageService:StorageUserService,
    private messageService: MessageService,
    private inventoryService:InventoryService,
    private excelService : ExcelService,
    private confirmationService: ConfirmationService,
    private router: Router) { 

      this.formViewInventory = this.fb.group({
        proyect: ['', []],
        typeItem: ['', []],
        dateInside: ['', []],
        dateOutside: ['', []],
        type: ['', []],
        employee: ['', []],
        amount: ['', []],
        date: ['', []],
        dateShop: ['', []],
        item: ['', []],
        idBill: ['', []],
      });
    }

  ngOnInit(): void {

    this.userLocalStorage= this.storageService.getCurrentUser(); 
    
    this.inventoryService.getAllHistories().subscribe((data) => {
      this.total= data.docs.length;
    });

  }

  showHistory(history:HistoryInventory){
    this.visibleDialog = true;
    
    this.formViewInventory.patchValue({
        proyect: history.proyect,
        typeItem: history.typeItem,
        dateInside: history.dateInside,
        dateOutside: history.dateOutside,
        type: history.type ,
        employee: history.employee,
        amount:history.amount ,
        date:history.date,
        dateShop: history.dateShop,
        item: history.item,
        idBill: history.idBill,
    });
  }

  deleteHistory(history: HistoryInventory) {
    this.visibleConfirm=true;
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el historial seleccionado de la base de datos?`,
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.inventoryService.deleteHistory(history._id).subscribe({
          next:(data) =>{
              if (data.success === true) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Eliminación Existosa',
                  detail: 'El Historial ha sido eliminado con éxito',
                  life: 3000,
                });
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              } 
          },error:() =>{
            this.messageService.add({
              severity: 'error',
              summary: 'Sucedio algo',
              detail: 'Ocurrió un error porfavor comunicate con el administrador',
              life: 3000,
            });
          },
        }
        );
      },
    });
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }

  downloadExcel(){
    let filterList:any[]=[]; 

    this.inventoryService.getAllHistories().subscribe((history) => {
      let dateInside:any="";
      let dateOutside:any="";
      history.docs.forEach((element)=>{
        if(element.dateInside=="Invalid date"){
          dateInside = ""
        }else{
          dateInside = element.dateInside;
        }
        if(element.dateOutside=="Invalid date"){
          dateOutside = ""
        }else{
          dateOutside = element.dateOutside;
        }
        filterList.push({
                Item: element.item,
                Tipo: element.typeItem,
                Fecha_Realización: element.date,
                Acción: element.type,
                Proyecto: element.proyect,
                Fecha_Compra:element.dateShop,
                Num_Factura: element.idBill,
                Cantidad: element.amount,
                Fecha_Ingreso: dateInside,
                Fecha_Salida:  dateOutside,
              });
      })
      this.excelService.downloadExcel(filterList,"Historial_Inventario");
    });
  }

  loadInventoryLazy(event?: LazyLoadEvent): void {
    this.loading = true;
    const desde = event!.first;
    const limite = event!.rows;
    const filters = event!.filters;
    setTimeout(() => {
      this.inventoryService.findByPage(desde, limite, filters)
      .subscribe(
        {next : (data) => {
            this.totalRecords = data.totalResults;
            this.histories = data.docs;
            this.loading = false;
          }}
      );
    },100)
    }

}
