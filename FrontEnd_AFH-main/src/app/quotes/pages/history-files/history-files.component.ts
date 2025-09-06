import { Component, OnInit } from '@angular/core';
import { QuotesService } from '../../services/quotes.service';
import { Quotes } from 'src/app/core/models/Quotes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-files',
  templateUrl: './history-files.component.html',
  styleUrls: ['./history-files.component.css']
})
export class HistoryFilesComponent implements OnInit {


  quotes: Quotes[];

  total: number;

  selectedSize = 'p-datatable-sm';

  quote: Quotes;
  constructor(private quotesService: QuotesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router) { }

  ngOnInit(): void {
    this.quotesService.getAllQuotes().subscribe((data) => {
      console.log(data);
      this.quotes = [...data.docs];
      this.total = this.quotes.length;
    });
  }

  updateQuote(quote: Quotes) {
    this.router.navigate(['/quotes/update'], {
      queryParams: { id: quote._id },
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
        detail: `La cotizacion se ha descargado de manera exitosa`,
        life: 3000,
      });
    });
    
  }

  deleteOneFile(file:any){
    this.quotesService.deleteOneFilePdf(file.name, file.rute).subscribe(
      (data) => {
        if (data.success === true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Archivo eliminado con éxito',
            life: 3000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);}
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
              summary: 'Successful',
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
              summary: 'Error Message',
              detail: 'Ocurrió un error',
              life: 3000,
            });
          }
        });
      },
    });
  }

}
