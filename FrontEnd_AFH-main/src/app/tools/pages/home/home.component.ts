import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { ToolsService } from '../../services/Tool.service';
import { Tool } from 'src/app/core/models/Tool';
import { User } from 'src/app/core/models/User';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { Employee } from 'src/app/core/models/Employes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../../../assets/css/HomeModules.css'],
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

//** lazyload */

  tools: Tool[];

  total: number;

  tool: Tool;

  selectedSize = 'p-datatable-sm';

  img:any;
  userLocalStorage:User;

  items:MenuItem [] = [
    {
        label: 'Agregar Herramienta',
        icon: 'bx bxs-folder-plus',
        routerLink: ['/tools/create'],
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
    private toolsService: ToolsService,
    public storageService:StorageUserService,
    private messageService: MessageService,
    private excelService : ExcelService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userLocalStorage= this.storageService.getCurrentUser();

    this.toolsService.getAllTools().subscribe((data) => {
      this.total = data.docs.length;
    });

  }

  addTools() {
    this.router.navigate(['/tools/create']);
  }

  updateTool(tool: Tool) {
    this.router.navigate(['/tools/update'], {
      queryParams: { id: tool._id },
    });
  }

  deleteTool(tool: Tool) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la herramienta ${tool.codeTool} de la base de datos?`,
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.toolsService.deleteTool(tool._id).subscribe((data) => {
          if (data.success === true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación Exitosa',
              detail: 'Herramienta eliminada con éxito',
              life: 3000,
            });
            // console.log(data.tool.codeTool);
            let folderPath = 'public/storage/archivos/Tools/' + data.tool.image;
            this.toolsService
              .deleteFilesTool(data.tool.codeTool, folderPath)
              .subscribe((data) => {
                console.log(data);
              });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else  {
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
    this.toolsService.getAllTools().subscribe((tool) => {

      tool.docs.forEach(element => {
        let admision=""
        let departure=""
        let inchargeName=""
        if (element.departureDate === 'Invalid date' || element.departureDate === '') {
          departure = '';
        } else {
          departure= element.departureDate;
        }
        if (element.admissionDate === 'Invalid date' || element.admissionDate === '') {
          admision = '';
        } else {
          admision= element.admissionDate;
        }
        if (element.inCharge === undefined) {
          inchargeName = '';
        } else {
          inchargeName = element.inCharge.completeName;
        }
        filterList.push({
          Nombre: element.name,
          Marca: element.brand,
          Codigo: element.codeTool,
          Fecha_Registro: element.registrationDate,
          Estado: element.status,
          Encargado: inchargeName,
          Fecha_Ingreso: admision,
          Fecha_Salida: departure ,
        })
      });
      this.excelService.downloadExcel(filterList,"Herramientas")
    });
  }

  loadInventoryLazy(event?: LazyLoadEvent): void {
    this.loading = true;
    const desde = event!.first;
    const limite = event!.rows;
    const filters = event!.filters;
    setTimeout(() => {
      this.toolsService.findByPage(desde, limite, filters)
      .subscribe(
        {next : (data) => {
            this.totalRecords = data.totalResults;
            this.tools = data.docs;
            this.loading = false;
          }
        }
      );
    },100)
  }
}
