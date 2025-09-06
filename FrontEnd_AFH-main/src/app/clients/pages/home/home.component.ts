import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { Clients } from 'src/app/core/models/Clients';
import { ClientsService } from '../../services/clients.service';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { User } from 'src/app/core/models/User';
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

//** lazyload */

  clients: Clients[];
  total: number;
  client: Clients;


  img:any;
  userLocalStorage:User;

  items:MenuItem[] = [
    {
        label: 'Agregar Cliente',
        icon: 'bx bxs-folder-plus',
        routerLink: ['/clients/create'],
    },
    {
        label: 'Descargar Excel',
        icon: 'pi pi-file-excel',
        command: () => {
            this.downloadExcel();
        }
    }
  ];

  constructor(private clientsService: ClientsService,
    public storageService:StorageUserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private excelService : ExcelService,
    private router: Router) { }

  ngOnInit(): void {
    this.userLocalStorage= this.storageService.getCurrentUser();
    this.clientsService.getAllClients().subscribe((data) => {
      // console.log(data);
      // this.clients = [...data.docs];
      this.total = data.docs.length;
    });
  }

  addClient() {
    this.router.navigate(['/clients/create']);
  }

  updateClient(client: Clients) {
    this.router.navigate(['/clients/update'], {
      queryParams: { id: client._id },
    });
  }

  deleteClient(client: Clients) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar al cliente ${client.name} de la base de datos?`,
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.clientsService.deleteClient(client._id).subscribe((data) => {
          if (data.success === true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación Exitosa',
              detail: 'Cliente eliminado con éxito',
              life: 3000,
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error',
              life: 3000,
            });
          }
        });
      },
    });
  }

  getStatus(status: string) {
    let statusCase: string = '';
    if (status === 'ACTIVA') {
      statusCase = 'success';
    } else if (status === 'OCUPADA') {
      statusCase = 'warning';
    } else if (status === 'INACTIVA') {
      statusCase = 'danger';
    }
    return statusCase;
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }

  loadInventoryLazy(event?: LazyLoadEvent): void {
    this.loading = true;
    const desde = event!.first;
    const limite = event!.rows;
    const filters = event!.filters;
    setTimeout(() => {
      this.clientsService.findByPage(desde, limite, filters)
      .subscribe(
        {next : (data) => {
            this.totalRecords = data.totalResults;
            this.clients = data.docs;
            this.loading = false;
          }}
      );
    },100);
    }

  downloadExcel(){
      let filterList:any[]=[]; 
      this.clientsService.getAllClients().subscribe((clients) => {
        clients.docs.forEach((element)=>{
          filterList.push({
                  Nombre: element.name,
                  Nit: element.nit,
                  Dirección: element.address,
                  Municipio: element.city,
                  Departamento: element.department,
                  Estado: element.status,
                });
        })
        this.excelService.downloadExcel(filterList,"Clientes");
      });
    }

}
