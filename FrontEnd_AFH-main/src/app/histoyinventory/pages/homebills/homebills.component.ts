import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { HistoryInventory } from 'src/app/core/models/HistoryInventory';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { InventoryService } from '../../services/inventory.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/User';
import { Bills } from 'src/app/core/models/Bills';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-homebills',
  templateUrl: './homebills.component.html',
  styleUrls: ['../../../../assets/css/HomeModules.css']
})
export class HomebillsComponent implements OnInit {
  @ViewChild('dt') tableBill: Table;

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
        label: 'Agregar Factura',
        // icon: 'pi pi-plus',
        icon: 'bx bxs-folder-plus',
        routerLink: ['/history/create'],
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

  bills: Bills[];

  total: number;

  history: HistoryInventory;

  selectedSize = 'p-datatable-sm';

  img:any;
  userLocalStorage:User;
  visibleDialog: boolean = false;
  visibleConfirm: boolean = false;

  constructor(
    private fb: FormBuilder,
    public storageService:StorageUserService,
    private messageService: MessageService,
    private inventoryService:InventoryService,
    private excelService : ExcelService,
    private confirmationService: ConfirmationService,
    private router: Router) { 

      this.formViewInventory = this.fb.group({
        vat: ['', []],
        idBill: ['', []],
        dateShop: ['', []],
        total: ['', []],
        price: ['', []],
        retention: ['', []],
        provider: ['', []],
      });
    }

  ngOnInit(): void {

    this.userLocalStorage= this.storageService.getCurrentUser(); 
    
    this.inventoryService.getAllBills().subscribe((data) => {
      this.total= data.docs.length;
    });

  }

  showBill(bill:Bills){
    this.visibleDialog = true;
    
    this.formViewInventory.patchValue({
        vat: bill.vat,
        idBill: bill.idBill,
        dateShop: bill.dateShop,
        total: this.formatDecimal(bill.total),
        price: this.formatDecimal(bill.price) ,
        retention: this.formatDecimal(Number(bill.retention)) ,
        provider: bill.provider ,
    });
  }

  deleteBill(bill: Bills) {
    this.visibleConfirm=true;
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la factura ${bill.idBill} de la base de datos?`,
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.inventoryService.deleteBills(bill._id).subscribe({
          next:(data) =>{
              if (data.success === true) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Eliminación Existosa',
                  detail: 'La factura ha sido eliminada con éxito',
                  life: 3000,
                });
                setTimeout(() => {
                  window.location.reload();
                  // this.tableBill.reset();
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

  formatDecimal(value: number): string {
    var COPObj = {style: "currency",currency: "COP", maximumFractionDigits: 0}
    return value.toLocaleString("es-CO", COPObj);
  }

  downloadExcel(){
    let filterList:any[]=[]; 
    let idItem=0;
    let totalCosto:number=0;

    this.inventoryService.getAllBills().subscribe((bill) => {
      bill.docs.forEach((element)=>{
        idItem++;
        totalCosto+=element.total;
        filterList.push({
                Item:idItem,
                Proveedor: element.provider,
                Num_Factura: element.idBill,
                Precio:this.formatDecimal(element.price),
                Iva: this.formatDecimal(Number(element.vat)),
                Retención: element.retention,
                Total:this.formatDecimal(element.total),
                Fecha_Compra:element.dateShop,
              });
      })
      filterList.push({TotalFacturas:this.formatDecimal(totalCosto)});
      this.excelService.downloadExcel(filterList,"Facturas");
    });
  }

  loadInventoryLazy(event?: LazyLoadEvent): void {
    this.loading = true;
    const desde = event!.first;
    const limite = event!.rows;
    const filters = event!.filters;
    setTimeout(() => {
      this.inventoryService.findByPageBills(desde, limite, filters)
      .subscribe(
        {next : (data) => {
            this.totalRecords = data.totalResults;
            this.bills = data.docs;
            this.loading = false;
          }}
      );
    },100)
  }

}
