import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { User } from 'src/app/core/models/User';
import { ServiceStaffService } from '../../services/service-staff.service';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { ExcelService } from 'src/app/core/services/excel.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['../../../../assets/css/HomeModules.css'],
})
export class StaffComponent implements OnInit {
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

//** lazyload */

  userDialog: boolean;

  users: User[];

  optionRole: any[] = [];

  user: User;

  submitted: boolean;

  statuses: any[];

  total: number;
  selectedSize = 'p-datatable-sm';

  img:any;
  userLocalStorage:User;

  items:MenuItem[] = [
    {
        label: 'Agregar Usuario',
        icon: 'bx bxs-folder-plus',
        routerLink: ['/staff/create'],
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
    private auth: AuthenticationService,
    private messageService: MessageService,
    public storageService:StorageUserService,
    private excelService : ExcelService,
    private confirmationService: ConfirmationService,
    private staffService: ServiceStaffService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.userLocalStorage= this.storageService.getCurrentUser();
    this.img= this.storageService.getImgUser();
    
    this.auth.getAllUsers().subscribe((user) => {
      this.users = [...user.docs];
      this.total= this.users.length;
    });
  }

  addUsers() {
    this.router.navigate(['/staff/create']);
  }

  updateUser(user: User) {
    this.router.navigate(['/staff/update'], {
      queryParams: { id: user._id },
    });
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar al usuario ${user.name} ${user.lastName} de la base de datos?`,
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.staffService.deleteUser(user._id).subscribe((data) => {
          if (data.success === true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación Exitosa',
              detail: 'El Usuario ha sido eliminado con exito',
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

  loadInventoryLazy(event?: LazyLoadEvent): void {
    this.loading = true;
    const desde = event!.first;
    const limite = event!.rows;
    const filters = event!.filters;
    setTimeout(() => {
      this.staffService.findByPage(desde, limite, filters)
      .subscribe(
        {next : (data) => {
            this.totalRecords = data.totalResults;
            this.users = data.docs;
            this.loading = false;
          }}
      );
    },100)
    
    
    }

}
