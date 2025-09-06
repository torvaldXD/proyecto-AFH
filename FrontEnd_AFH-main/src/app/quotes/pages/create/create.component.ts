import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { Item, Quotes } from 'src/app/core/models/Quotes';
import { QuotesService } from '../../services/quotes.service';
import { Router } from '@angular/router';
import { Clients } from 'src/app/core/models/Clients';
import { Codes } from 'src/app/core/models/Codes';
import * as moment from 'moment';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { User } from 'src/app/core/models/User';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
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
  public formAddQuote: FormGroup;
  loading: boolean = false;
  public quote: Quotes = new Quotes();
  resultsClients: Clients[] = [];

  public listCodes: Codes[];
  // prueba
  products: Item[];

  aprueba: boolean = true;

  selectedItem: Item;

  milista: Item[] = [];

  img:any;
  userLocalStorage:User;

  constructor(
    private fb: FormBuilder,
    public storageService:StorageUserService,
    public messageService: MessageService,
    public quotesService: QuotesService,
    private router: Router
  ) {
    this.formAddQuote = this.fb.group({
      addressedTo: ['', [Validators.required]],
      project: ['', [Validators.required]],
      client: ['', [Validators.required]],
      deliveryTime: ['', [Validators.required]],
      code: ['', []],
      pay: ['', [Validators.required]],
      area: ['', [Validators.required]],
      scope: ['', []],
      employer: ['', [Validators.required]],
      contractor: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

    this.userLocalStorage= this.storageService.getCurrentUser();
    this.img= this.storageService.getImgUser();
    
    this.quotesService.getAllCodesQuotes().subscribe((data) => {
      this.listCodes = [...data.docs];

      if (this.listCodes.length === 0) {
        this.generateCodeString('0');
      } else if (this.listCodes.length !== 0) {
        this.generateCodeString(this.listCodes[0].code);
      }
    });
  }

  addQuote() {
    if (this.milista.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Verificación Items',
        detail: `Porfavor digite al menos un item`,
      });
    } else {
      this.milista.forEach((element) => {
        element.fullValue = element.amount * element.unitValue;
      });
      this.quote.code = this.formAddQuote.value.code;
      this.quote.project = this.formAddQuote.value.project;
      this.quote.client = this.formAddQuote.value.client;
      this.quote.pay = this.formAddQuote.value.pay;
      this.quote.addressedTo = this.formAddQuote.value.addressedTo;
      this.quote.items = this.milista;
      this.quote.deliveryTime = this.formAddQuote.value.deliveryTime;
      this.quote.contractor = this.formAddQuote.value.contractor;
      this.quote.employer = this.formAddQuote.value.employer;
      this.quote.area = this.formAddQuote.value.area;
      this.quote.scope = this.formAddQuote.value.scope;
      this.quote.creationDate = moment(new Date()).format('YYYY-MM-DD');

      this.quotesService.createQuotes(this.quote).subscribe({
        next: (data) => {
          this.loading = true;
          if (data.message === 'Quote create sucessfull') {
            this.quotesService.createFilePDF(this.quote).subscribe((data) => {
              if (data.message === 'Create PDF Quote successfull') {
                // console.log("llega al completarse la funcion",data.doc);
                let nameFileDownload = data.doc.name;
                console.log('nombrearchivo', data.doc.name);
                console.log('ruta', data.doc.url);

                setTimeout(() => {
                  let miRuta = '' + data.doc.url;
                  this.pdfclik(miRuta, nameFileDownload);
                  this.loading = false;
                }, 2000);
              }
            });
          } else if (data.message == 'The Quote already exists in BD') {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `La cotización con código ${data.price.code} ya ha sido registrado anteriormente`,
              life: 3000,
            });
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Ocurrio algo!',
            detail: 'Por favor comuníquese con el administrador',
            life: 5000,
          });
          console.log('ocurrió un error al hacer la petición');
        },
      });
    }
  }

  userBack() {
    this.router.navigate(['/quotes/home']);
  }

  changeContractor(event: any) {
    let mensaje = `El suministro de elementos de protección personal (Guantes, respiradores, botas etc.);\nEl suministro de herramientas (manuales) y eléctricas.;\nEl suministro de personal capacitado para el desarrollo del trabajo.;`;
    if (event.checked == false) {
      // this.formAddQuote.patchValue({description:''})
      this.formAddQuote.controls['contractor'].setValue('');
    }
    if (event.checked == true) {
      // this.formAddQuote.patchValue({description:mensaje})
      this.formAddQuote.controls['contractor'].setValue(mensaje);
    }
  }
  changeScope(event: any) {
    let mensaje = `Suministros materiales;Fabricación.;Transporte y entrega en obra.;`;
    if (event.checked == false) {
      // this.formAddQuote.patchValue({description:''})
      this.formAddQuote.controls['scope'].setValue('');
    }
    if (event.checked == true) {
      // this.formAddQuote.patchValue({description:mensaje})
      this.formAddQuote.controls['scope'].setValue(mensaje);
    }
  }
  changeEmployer(event: any) {
    let mensaje = `La disposición del sitio de trabajo.;\nEl suministro de energía 110v, 220;\nEl suministro de materiales y consumibles necesarios para el desarrollo del trabajo.;`;
    if (event.checked == false) {
      this.formAddQuote.controls['employer'].setValue('');
    }
    if (event.checked == true) {
      this.formAddQuote.controls['employer'].setValue(mensaje);
    }
  }

  findClients(event: any) {
    this.quotesService.findByAutoComplete(event.query).subscribe((data) => {
      this.resultsClients = data.docs;
    });
  }

  verifyNumber(num: number) {
    let newNumber;
    for (let index = 0; index < 10; index++) {
      if (num < 10) {
        newNumber = '0' + num;
      } else {
        newNumber = num;
      }
    }
    return newNumber;
  }

  generateCodeString(str: string) {
    let code = '';

    if (str === '0') {
      code = `${this.verifyNumber(Number(str))}-${moment().format('YYYY')}`;
    } else {
      let separate = str.split('-');
      let firstNumber: number = Number(separate[0]) + 1;

      code = `${this.verifyNumber(firstNumber)}-${moment().format('YYYY')}`;
    }

    this.formAddQuote.controls['code'].setValue(code);
  }

  //change items list
  deleteItem() {
    if (this.selectedItem) {
      const index = this.milista.indexOf(this.selectedItem);
      if (index !== -1) {
        this.milista.splice(index, 1);

        // Reordenar los números de los elementos restantes
        for (let i = 0; i < this.milista.length; i++) {
          this.milista[i].number = i + 1;
        }
      }
    }
    this.selectedItem = undefined as any;
  }
  createItem() {
    let item = new Item();
    item.number = this.milista.length + 1;
    item.description = 'default';
    item.unit = 'UNID';
    item.unitValue = 0;
    item.amount = 1;
    item.fullValue = item.amount * item.unitValue;
    this.milista.push(item);
    this.products = this.milista;
    // console.log(this.milista.length);
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }

  pdfclik(pathUrl: string, nameDoc: string) {
    this.quotesService.downloadFilePDF(pathUrl).subscribe((data: any) => {
      const dataType = data.type;
      const blobData = new Blob([data], { type: dataType });
      // Crea un objeto URL para el archivo
      const downloadUrl = window.URL.createObjectURL(blobData);

      // Crea un enlace para descargar el archivo
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.setAttribute('download', nameDoc);
      document.body.appendChild(downloadLink);

      // Simula el clic en el enlace para descargar el archivo
      downloadLink.click();

      // Libera el objeto URL y elimina el enlace
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(downloadLink);
      this.messageService.add({
        severity: 'success',
        summary: 'Creación Exitosa',
        detail: `La cotización ha sido creada con éxito`,
      });
      setTimeout(() => {
        this.router.navigate(['/quotes/home']);
      }, 2000);
    });
  }


  formatDecimal(value: number): string {
    var COPObj = {style: "currency",currency: "COP", maximumFractionDigits: 0}
    return value.toLocaleString("es-CO", COPObj);
  }
}
