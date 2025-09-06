import { Component, HostListener, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/services/authentication.service';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { StorageUserService } from '../core/services/storageuser.service';
import { ExcelService } from '../core/services/excel.service';
import { ServiceStaffService } from '../staff/services/service-staff.service';
import { Router } from '@angular/router';
import { User } from '../core/models/User';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HistoryInventory } from '../core/models/HistoryInventory';
import { InventoryService } from '../histoyinventory/services/inventory.service';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['../../assets/css/HomeModules.css']
  // styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {

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
  //lazy load

    totalRecords!: number;
    loading: boolean = false;
    selectAll: boolean = false;
    public lazy = true;
    public selected: HistoryInventory = new HistoryInventory();

  //** lazyload */
  visibleDialog: boolean= false;

  histories: HistoryInventory[];

  optionRole: any[] = [];

  user: HistoryInventory;

  public formViewInventory: FormGroup;

  submitted: boolean;

  statuses: any[];

  total: number;
  selectedSize = 'p-datatable-sm';

  img:any;
  userLocalStorage:User;


  items:MenuItem[] = [
    {
        label: 'Agregar Inventario',
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

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private messageService: MessageService,
    public storageService:StorageUserService,
    public inventoryService:InventoryService,
    private excelService : ExcelService,
    private confirmationService: ConfirmationService,
    private staffService: ServiceStaffService,
    private router: Router
  ) {

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

  handleButton(event:any){
    console.log(event);
  }
  addUsers() {
    this.router.navigate(['/staff/create']);
  }

  updateUser(user: User) {
    this.router.navigate(['/staff/update'], {
      queryParams: { id: user._id },
    });
  }

  deleteHistory(user: User) {
    this.confirmationService.confirm({
      message: `¿Estás seguto de eliminar a ${user.name} ${user.lastName} de la base de datos?`,
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.staffService.deleteUser(user._id).subscribe((data) => {
          if (data.success === true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Usuario eliminado con éxito',
              life: 3000,
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error Message',
              detail: 'Ocurrió un error',
              life: 3000,
            });
          }
        });
      },
    });
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }

  downloadExcel(){
    let filterList:any[]=[]; 
    this.auth.getAllUsers().subscribe((user) => {

      user.docs.forEach(element => {
        filterList.push({
          Nombre: element.name,
          Apellido: element.lastName,
          Correo: element.email,
          Area: element.area,
          Numero_Telefono: element.numberPhone,
          Rol: element.role
        })
      });
      this.excelService.downloadExcel(filterList,"Usuarios")
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
