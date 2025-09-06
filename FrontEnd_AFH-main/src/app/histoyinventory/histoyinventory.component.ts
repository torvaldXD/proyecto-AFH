import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Bills } from '../core/models/Bills';
import { Supplies } from '../core/models/Supplies';
import { HistoryInventory } from '../core/models/HistoryInventory';
import { Tool } from '../core/models/Tool';
import { InventoryService } from './services/inventory.service';
import { Employee } from '../core/models/Employes';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-histoyinventory',
  templateUrl: './histoyinventory.component.html',
  styleUrls: ['./histoyinventory.component.css']
})
export class HistoyinventoryComponent implements OnInit {

  public formAddInventory: FormGroup;
  public formAddBill: FormGroup;

  public bill:Bills= new Bills();

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
    public messageService: MessageService,
    private inventoryService:InventoryService) { 

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
              summary: 'Creacion sde Factura',
              detail: `La factura ha sido creada con éxito`,
            });
            this.formAddBill.reset();
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
                  console.log(data);
                  this.formAddInventory.reset();
              },
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
                  console.log(data);
                  this.formAddInventory.reset();
              },
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
      
      this.inventoryService.createHistory(history).subscribe({
        next :(data) => {
            if(data.success === true && data.message==='History create sucessfull'){
              this.inventoryService.updateSupply(this.supplieSelect._id,this.supplieSelect).subscribe({
                next :(data) => {
                    console.log("entrada",data);
                    this.formAddInventory.reset();
                },
              })
            }

            
            
        },
        error: () =>{
            
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

      // history.dateShop = moment(this.formAddInventory.value.dateShop, 'DD/MM/YYYY').format('DD/MM/YYYY');
      

      this.supplieSelect.amount = this.formAddInventory.value.amount;
      
      this.inventoryService.createHistory(history).subscribe({
        next :(data) => {
          if(data.success === true && data.message==='History create sucessfull'){
            this.inventoryService.updateSupply(this.supplieSelect._id,this.supplieSelect).subscribe({
              next :(data) => {
                  console.log("salida",data);
                  this.formAddInventory.reset();
              },
            })
          }else{

          }
            
        },
        error: ()=>{

        }
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

    
    // this.formAddInventory.reset();
  }
  
}
