import { Component, HostListener, OnInit } from '@angular/core';
import { Quotes } from 'src/app/core/models/Quotes';
import { QuotesService } from '../../services/quotes.service';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { User } from 'src/app/core/models/User';
import { ExcelService } from 'src/app/core/services/excel.service';

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

  quotes: Quotes[];

  total: number;

  quote: Quotes;

  selectedSize = 'p-datatable-sm';

  img:any;
  userLocalStorage:User;

  items:MenuItem[] = [
    {
        label: 'Agregar Cotización',
        icon: 'bx bxs-folder-plus',
        routerLink: ['/quotes/create'],
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
    private quotesService: QuotesService
    ,public storageService:StorageUserService,
    private messageService: MessageService,
    private excelService : ExcelService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userLocalStorage= this.storageService.getCurrentUser();

    this.quotesService.getAllQuotes().subscribe((data) => {
      this.total = data.docs.length;
    });
  }

  addQuote() {
    this.router.navigate(['/quotes/create']);
  }

  updateQuote(quote: Quotes) {
    this.router.navigate(['/quotes/update'], {
      queryParams: { id: quote._id },
    });
  }

  deleteQuote(quote: Quotes) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la cotización ${quote.code} de la base de datos?`,
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.quotesService.deleteQuote(quote._id).subscribe((data) => {
          if (data.success === true) {
            this.messageService.add({
              severity: 'success',
              summary: 'Eliminación Exitosa',
              detail: 'Cotización eliminada con éxito',
              life: 3000,
            });

            this.quotesService
              .deleteFilesQuote(data.price.code, data.price)
              .subscribe((data) => {
                console.log(data);
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

  downloadOneFile(file:any){
    this.quotesService.downloadFilePDF(file.rute).subscribe((data: any) => {
      const dataType = data.type;
      const blobData = new Blob([data], { type: dataType });
      // Crea un objeto URL para el archivo
      const downloadUrl = window.URL.createObjectURL(blobData);

      // Crea un enlace para descargar el archivo
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.setAttribute('download', file.name);
      document.body.appendChild(downloadLink);

      // Simula el clic en el enlace para descargar el archivo
      downloadLink.click();

      // Libera el objeto URL y elimina el enlace
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(downloadLink);
      this.messageService.add({
        severity: 'success',
        summary: 'Descarga Exitosa',
        detail: `La cotización se ha descargado de manera exitosa`,
        life: 3000,
      });
    });
    
  }

  deleteOneFile(file:any){
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el archivo ${file.name} de la base de datos?`,
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.quotesService.deleteOneFilePdf(file.name, file.rute).subscribe(
          (data) => {
            if (data.success === true) {
              this.messageService.add({
                severity: 'success',
                summary: 'Eliminación Exitosa',
                detail: 'Archivo eliminado con éxito',
                life: 3000,
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);}
          });
      }})
    
    
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }

  downloadExcel(){
    let filterList:any[]=[];
    let itemList:any[]=[];

    this.quotesService.getAllQuotes().subscribe((quotes) => {

      quotes.docs.forEach(element => {
        element.items.forEach(ite=>{
          const concatenacion=`Numero Item:${ite.number} Descripcion:${ite.description} Cantidad:${ite.amount} Valor Unidad:${ite.unitValue} Valor Total:${ite.fullValue}`
          itemList.push(concatenacion); 
        })
        filterList.push({
          Codigo: element.code,
          Forma_Pago: element.pay,
          Proyecto: element.project,
          Cliente: element.client.name,
          Dirigido_A: element.addressedTo,
          Fecha_Creacion: element.creationDate,
          Plazo_Entrega: element.deliveryTime,
          Condiciones_Comerciales_Empleador: element.employer,
          Condiciones_Comerciales_Contrastista: element.contractor,
          Alcance: element.scope,
          Items: JSON.stringify(itemList),
        })
        itemList=[];
      });
      this.excelService.downloadExcel(filterList,"Cotizaciones")
    });
  }

  loadInventoryLazy(event?: LazyLoadEvent): void {
    this.loading = true;
    const desde = event!.first;
    const limite = event!.rows;
    const filters = event!.filters;
    setTimeout(() => {
      this.quotesService.findByPage(desde, limite, filters)
      .subscribe(
        {next : (data) => {
            this.totalRecords = data.totalResults;
            this.quotes = data.docs;
            this.loading = false;
          }}
      );
    },100)
    
    
    }
}
