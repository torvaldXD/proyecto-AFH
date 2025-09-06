import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { Supplies } from 'src/app/core/models/Supplies';
import { User } from 'src/app/core/models/User';
import { SuppliesService } from '../../services/supplies.service';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { ExcelService } from 'src/app/core/services/excel.service';

@Component({
  selector: 'app-supplies',
  templateUrl: './supplies.component.html',
  styleUrls: ['../../../../assets/css/HomeModules.css'],
})
export class SuppliesComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const sidebar = document.getElementById('sidebar');
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    if (screenWidth < 768 ) {
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

  supplies: Supplies[];

  supply: Supplies;

  total:Number;
  selectedSize = 'p-datatable-sm';

  img:any;
  userLocalStorage:User;

  items:MenuItem[] = [
    {
        label: 'Agregar Suministro',
        icon: 'bx bxs-folder-plus',
        routerLink: ['/supplies/create'],
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
    private messageService: MessageService,
    public storageService:StorageUserService,
    private excelService : ExcelService,
    private confirmationService: ConfirmationService,
    private suppliesService: SuppliesService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.userLocalStorage= this.storageService.getCurrentUser();

    this.suppliesService.getAllSupplies().subscribe((data) => {
      this.total = data.docs.length;
    });

  }

  addSupplies() {
    this.router.navigate(['/supplies/create']);
  }

  updateSupply(user: User) {
    this.router.navigate(['/supplies/update'], {
      queryParams: { id: user._id },
    });
  }

  deleteSupply(supply: Supplies) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el suministro ${supply.name} de la base de datos?`,
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.suppliesService.deleteSupply(supply._id).subscribe((data) => {
          if (data.success === true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación Exitosa',
              detail: 'El Suministro se eliminó con éxito',
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

  getSeverity(status: string) {
    let value = '';
    switch (status) {
      case 'EN EXISTENCIA':
        value = 'success';
        break;
      case 'POCA EXISTENCIA':
        value = 'warning';
        break;
      case 'SIN EXISTENCIA':
        value = 'danger';
        break;
    }
    return value;
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }

  downloadExcel(){
    let filterList:any[]=[]; 
    this.suppliesService.getAllSupplies().subscribe((supplies) => {

      supplies.docs.forEach(element => {
        filterList.push({
          Nombre: element.name,
          Descripcion: element.description,
          Stock: element.inventoryStatus,
          Cantidad: element.amount,
          Unidad: element.unit,
        })
      });
      this.excelService.downloadExcel(filterList,"Suministros");
    });
  }

  loadInventoryLazy(event?: LazyLoadEvent): void {
    this.loading = true;
    const desde = event!.first;
    const limite = event!.rows;
    const filters = event!.filters;
    setTimeout(() => {
      this.suppliesService.findByPage(desde, limite, filters)
      .subscribe(
        {next : (data) => {
            this.totalRecords = data.totalResults;
            this.supplies = data.docs;
            this.loading = false;
          }}
      );
    },100)
    
    
    }
}
