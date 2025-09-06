import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { HistoryInventory } from 'src/app/core/models/HistoryInventory';
import { Supplies } from 'src/app/core/models/Supplies';
import { InventoryService } from '../../services/inventory.service';
import { Tool } from 'src/app/core/models/Tool';
import { Employee } from 'src/app/core/models/Employes';
import { Bills } from 'src/app/core/models/Bills';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { User } from 'src/app/core/models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['../../../../assets/css/CreateModules.css']
})
export class CreateComponent implements OnInit {

  public formAddInventory: FormGroup;
  public formAddBill: FormGroup;

  public bill:Bills= new Bills();

  userLocalStorage:User;

  resultsTools: Tool[]= [];
  resultsSupplies: Supplies[]= [];
  resultsEmployees: Employee[]= [];
  resultsBills: Bills[]= [];

  supplieSelect:Supplies;
  toolSelect:Tool;

  optionItem: any[] = [
    { label: 'Entrada', value: 'entry' },
    { label: 'Salida', value: 'output' }
  ];

  optionEntry: any[] = [
    { label: 'Herramienta', value: 'tool' },
    { label: 'Suministro', value: 'supplie' }
  ];

  constructor(
    private fb: FormBuilder,
    public  storageService:StorageUserService,
    public messageService: MessageService,
    private inventoryService:InventoryService,
    public router:Router) { 

    this.formAddInventory = this.fb.group({
      proyect: ['', []],
      tool: [null, []],
      supply: [null, []],
      bill: ['', []],
      amount: ['', []],
      numberBill: ['', []],
      unit: ['', []],
      item: [null, []],
      entry: [null, []],
      dateInside: [null, []],
      dateShop: [null, []],
      dateOutside: [null, []],
      inCharge: [null, []],
      inCharge2: ['', []],
      bill2: ['', []],
    });
    this.formAddBill = this.fb.group({
      provider:['', [Validators.required]], 
      price:['', [Validators.required]],
      vat: ['', [Validators.required]],
      retention: ['', []],
      idBill: ['', [Validators.required]],
      dateShop: ['', [Validators.required]],
      total: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.userLocalStorage= this.storageService.getCurrentUser(); 
  }

  addBill(){
    const dateShopFormated = moment(this.formAddBill.value.dateShop, 'DD/MM/YYYY').format('DD/MM/YYYY');

    this.bill.dateShop= dateShopFormated ;
    this.bill.provider= this.formAddBill.value.provider;
    this.bill.total= this.formAddBill.value.total;
    this.bill.price= this.formAddBill.value.price;
    this.bill.idBill= this.formAddBill.value.idBill;
    this.bill.vat = this.formAddBill.value.vat;
    this.bill.retention = this.formAddBill.value.retention;

    this.inventoryService.createBills(this.bill).subscribe(
      {
        next: (data)=> {
          if(data.success===true){
            this.messageService.add({
              severity: 'success',
              summary: 'Creación Exitosa',
              detail: `La factura ha sido creada con éxito`,
            });
            setTimeout(() => {
              this.router.navigate(['/history/bills']);
            }, 2000);
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Ocurrió algo en el sistema',
            detail: 'Por favor comuníquese con el administrador',
          });
        },
      }
    )

  }

  changePrice (event:any){
    let totalpriceVat: Number=0;
    totalpriceVat = event.value * 0.19;
    let totalprice:number = event.value + totalpriceVat - this.formAddBill.value.retention;
    this.formAddBill.controls['vat'].setValue(totalpriceVat);
    this.formAddBill.controls['total'].setValue(totalprice);

  }
  changeRetention (event:any){
    if(event===null){
      let totalpriceVat: Number=0;
    totalpriceVat = this.formAddBill.value.price * 0.19;
    let totalprice:number = this.formAddBill.value.price+ totalpriceVat;
    this.formAddBill.controls['vat'].setValue(totalpriceVat);
    this.formAddBill.controls['total'].setValue(totalprice);
    }else{
      this.formAddBill.controls['total'].setValue(this.formAddBill.value.total-event);
    }
  }

  selectSupply(event:any){
    this.supplieSelect = this.formAddInventory.value.supply;
    this.formAddInventory.controls['amount'].setValue(this.supplieSelect.amount);
  }

  clearSupply(event:any){
    this.formAddInventory.controls['amount'].setValue('');
    this.supplieSelect=new Supplies();
  }

  addHistoryInventory(){
    const history = new HistoryInventory();
    //entrada de herramienta
    if(this.formAddInventory.value.item == 'entry' && this.formAddInventory.value.entry === 'tool'){
      this.toolSelect = this.formAddInventory.value.tool;
      history.type = 'Entrada'
      history.typeItem = 'Herramienta'
      history.date = moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY');
      history.item = this.formAddInventory.value.tool.codeTool;
      history.dateInside = moment(this.formAddInventory.value.dateInside, 'DD/MM/YYYY').format('DD/MM/YYYY');;
      history.dateOutside = this.toolSelect.departureDate;

      history.proyect = '';
      history.dateShop = '';
      history.idBill = '';
      history.employee= '';
      history.amount = 0 ;


      this.toolSelect.admissionDate = "Invalid date"
      this.toolSelect.departureDate = "Invalid date"
      this.toolSelect.inCharge = this.formAddInventory.value.inCharge2 ;
      this.toolSelect.status = "ACTIVA" ;
      
      
      this.inventoryService.createHistory(history).subscribe({
        next :(data) => {
          if(data.success === true && data.message==='History create sucessfull'){
            this.inventoryService.updateTool(this.toolSelect._id,this.toolSelect).subscribe({
              next :(data) => {
                if(data.success===true){
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Creación Exitosa',
                    detail: `El inventario ha sido creado con éxito`,
                  });
                  setTimeout(() => {
                    this.router.navigate(['/history/home']);
                  }, 2000);
                }
              },
              error: ()=>{
                this.messageService.add({
                  severity: 'info',
                  summary: 'Ocurrió algo en el sistema',
                  detail: 'Por favor comuníquese con el administrador',
                  life: 5000,
                });
              }
            })
          }
            
        },
      })
    }
    //salida de herramienta
    if(this.formAddInventory.value.item == 'output' && this.formAddInventory.value.entry === 'tool'){

      this.toolSelect = this.formAddInventory.value.tool;
      history.type = 'Salida'
      history.typeItem = 'Herramienta'
      history.date = moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY');
      history.item = this.formAddInventory.value.tool.codeTool;
      
      history.dateInside = moment(this.formAddInventory.value.dateInside, 'DD/MM/YYYY').format('DD/MM/YYYY');
      history.dateOutside = moment(this.formAddInventory.value.dateOutside, 'DD/MM/YYYY').format('DD/MM/YYYY');
      
      
      //defautl
      history.proyect = this.formAddInventory.value.proyect;
      history.dateShop = ''
      history.idBill = '';
      history.employee = this.formAddInventory.value.inCharge.completeName;
      history.amount = 0 ;
      
      console.log("nombre encargado",this.formAddInventory.value.inCharge.completeName);
      
      this.toolSelect.admissionDate = history.dateInside = moment(this.formAddInventory.value.dateInside, 'DD/MM/YYYY').format('DD/MM/YYYY');
      this.toolSelect.departureDate = history.dateOutside = moment(this.formAddInventory.value.dateOutside, 'DD/MM/YYYY').format('DD/MM/YYYY');
      this.toolSelect.inCharge = this.formAddInventory.value.inCharge;
      this.toolSelect.status = "OCUPADA" ;
      
      this.inventoryService.createHistory(history).subscribe({
        next :(data) => {
          if(data.success === true && data.message==='History create sucessfull'){
            this.inventoryService.updateTool(this.toolSelect._id,this.toolSelect).subscribe({
              next :(data) => {
                if(data.success===true){
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Creación Exitosa',
                    detail: `El Inventario ha sido creado con éxito`,
                  });
                  setTimeout(() => {
                    this.router.navigate(['/history/home']);
                  }, 2000);
                }
              },
              error:()=>{
                this.messageService.add({
                  severity: 'info',
                  summary: 'Ocurrió algo en el sistema',
                  detail: 'Por favor comuníquese con el administrador',
                  life: 5000,
                });
              }
            })
          }
            
        },
      })
    }
    //entrada de suministro
    if(this.formAddInventory.value.item == 'entry' && this.formAddInventory.value.entry === 'supplie'){
      this.supplieSelect = this.formAddInventory.value.supply;
      history.type = 'Entrada';
      history.typeItem = 'Suministro'
      history.item = this.formAddInventory.value.supply.name;
      history.date = moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY');
      history.dateShop = moment(this.formAddInventory.value.dateShop, 'DD/MM/YYYY').format('DD/MM/YYYY');
      history.amount = this.formAddInventory.value.amount - this.supplieSelect.amount;

      //default
      history.proyect = '';
      history.dateInside = '';
      history.dateOutside = '';
      history.idBill = this.formAddInventory.value.bill.idBill;
      history.employee=this.formAddInventory.value.inCharge2;

      this.supplieSelect.amount = this.formAddInventory.value.amount;

      if(this.supplieSelect.amount<1){
        this.supplieSelect.inventoryStatus = 'SIN EXISTENCIA';
      }
      if(this.supplieSelect.amount > 1 && this.supplieSelect.amount<= this.supplieSelect.maxRange){
        this.supplieSelect.inventoryStatus = 'POCA EXISTENCIA';
      }
      if(this.supplieSelect.amount > this.supplieSelect.maxRange){
        this.supplieSelect.inventoryStatus ='EN EXISTENCIA';
      }
      
      this.inventoryService.createHistory(history).subscribe({
        next :(data) => {
            if(data.success === true && data.message==='History create sucessfull'){
              this.inventoryService.updateSupply(this.supplieSelect._id,this.supplieSelect).subscribe({
                next :(data) => {
                  if(data.success===true){
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Creación Exitosa',
                      detail: `El inventario ha sido creado con éxito`,
                    });
                    setTimeout(() => {
                      this.router.navigate(['/history/home']);
                    }, 2000);
                  }
                  },
                  error: () =>{
                    this.messageService.add({
                      severity: 'info',
                      summary: 'Ocurrió algo en el sistema',
                      detail: 'Por favor comuníquese con el administrador',
                      life: 5000,
                    });
                  },
              })
            } 
        },
      })
    }
    
    //salida de suministro
    if(this.formAddInventory.value.item == 'output' && this.formAddInventory.value.entry === 'supplie'){
      this.supplieSelect = this.formAddInventory.value.supply;
      history.type = 'Salida';
      history.typeItem = 'Suministro'
      history.item = this.formAddInventory.value.supply.name;
      history.date = moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY');
      history.amount =  this.supplieSelect.amount - this.formAddInventory.value.amount  ;

      history.proyect = this.formAddInventory.value.proyect;
      history.dateInside = '';
      history.dateOutside = '';
      history.dateShop = '';
      history.idBill = this.formAddInventory.value.bill.idBill;
      history.employee = this.formAddInventory.value.inCharge.completeName

      this.supplieSelect.amount = this.formAddInventory.value.amount;

      if(this.supplieSelect.amount<1){
        this.supplieSelect.inventoryStatus = 'SIN EXISTENCIA';
      }
      if(this.supplieSelect.amount > 1 && this.supplieSelect.amount<= this.supplieSelect.maxRange){
        this.supplieSelect.inventoryStatus = 'POCA EXISTENCIA';
      }
      if(this.supplieSelect.amount > this.supplieSelect.maxRange){
        this.supplieSelect.inventoryStatus ='EN EXISTENCIA';
      }
      
      this.inventoryService.createHistory(history).subscribe({
        next :(data) => {
          if(data.success === true && data.message==='History create sucessfull'){
            this.inventoryService.updateSupply(this.supplieSelect._id,this.supplieSelect).subscribe({
              next :(data) => {
                if(data.success===true){
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Creación Exitosa',
                    detail: `El inventario ha sido creado con éxito`,
                  });
                  setTimeout(() => {
                    this.router.navigate(['/history/home']);
                  }, 2000);
                }
                },
                error: ()=>{
                  this.messageService.add({
                    severity: 'info',
                    summary: 'Ocurrió algo en el sistema',
                    detail: 'Por favor comuníquese con el administrador',
                    life: 5000,
                  });
                }
            })
          } 
        },
      })
    }
  }


  findAutocompleteSupply(event:any){
    this.inventoryService.findByAutoCompleteTool(event.query).subscribe((data) => {
      this.resultsSupplies = data.docs;
    });
  }

  findAutocompleteBills(event:any){
    this.inventoryService.findByAutoCompleteBill(event.query).subscribe((data) => {
      this.resultsBills = data.docs;
    });
  }

  findEmployee(event:any){
    this.inventoryService.findByAutoCompleteEmployee(event.query).subscribe((data) => {
      // console.log(data);
      
      this.resultsEmployees = data.docs;
    });
  }

  findAutocompleteTool(event:any){
    this.inventoryService.findByAutoCompleteSupply(event.query).subscribe((data) => {
      this.resultsTools = data.docs;
      // console.log(data);
      
    });
  }

  changeEntry(event:any){
    if(event){
      this.formAddInventory.value;
    }
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }

  userBack() {
    this.router.navigate(['/history/home']);
  }

}
