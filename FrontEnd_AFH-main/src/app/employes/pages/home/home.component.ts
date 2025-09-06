import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { Employee } from 'src/app/core/models/Employes';
import { Tool } from 'src/app/core/models/Tool';
import { EmployesService } from '../../services/employes.service';
import { User } from 'src/app/core/models/User';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { ExcelService } from 'src/app/core/services/excel.service';

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

  //lazy load

  totalRecords!: number;
  loading: boolean = false;
  selectAll: boolean = false;
  public lazy = true;
  selectedSize = 'p-datatable-sm';
  // public selected: HistoryInventory = new HistoryInventory();

//** lazyload */

  employees: Employee[];

  total:number;

  employee: Employee;

  img:any;
  userLocalStorage:User;

  items:MenuItem[] = [
    {
        label: 'Agregar Empleado',
        icon: 'bx bxs-folder-plus',
        routerLink: ['/employes/create'],
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
    private employesService:EmployesService,
    public storageService:StorageUserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private excelService : ExcelService,
    private router: Router) { }

  ngOnInit(): void {
    this.userLocalStorage= this.storageService.getCurrentUser();
    
    this.employesService.getAllEmployees().subscribe((data) => {
      this.total= data.docs.length;
    });
  }

  addTools() {
    this.router.navigate(['/employes/create']);
  }

  updateTool(tool: Tool) {
    this.router.navigate(['/employes/update'], {
      queryParams: { id: tool._id },
    });
  }

  loadInventoryLazy(event?: LazyLoadEvent): void {
    this.loading = true;
    const desde = event!.first;
    const limite = event!.rows;
    const filters = event!.filters;
    setTimeout(() => {
      this.employesService.findByPage(desde, limite, filters)
      .subscribe(
        {next : (data) => {
            this.totalRecords = data.totalResults;
            this.employees = data.docs;
            this.loading = false;
          }}
      );
    },100)
    
    
    }

  deleteTool(employe: Employee) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar al empleado ${employe.name} ${employe.lastName} de la base de datos?`,
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.employesService.deleteEmployee(employe._id).subscribe((data) => {
          if (data.success === true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación exitosa',
              detail: 'Empleado eliminado con éxito',
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
    this.employesService.getAllEmployees().subscribe((employees) => {
      employees.docs.forEach((element)=>{
        filterList.push({
                Nombre: element.name,
                Apellido: element.lastName,
                Num_Telefono: element.numberPhone,
                Num_Identificación: element.idNumber,
              });
      })
      this.excelService.downloadExcel(filterList,"Empleados");
    });
  }

}
