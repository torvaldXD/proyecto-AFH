import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuppliesService } from '../../services/supplies.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Supplies } from 'src/app/core/models/Supplies';
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

  public formAddSupply: FormGroup;

  public options:[] = [];
  public value1:Number;
  img:any;
  userLocalStorage:User;

  public supply: Supplies = new Supplies();

  public optionRole = [
    { name: 'SELECCIONAR', value: null },
    { name: 'EN EXISTENCIA', value: 'EN EXISTENCIA' },
    { name: 'POCAS EXISTENCIA', value: 'POCAS EXISTENCIA' },
    { name: 'SIN EXISTENCIA', value: 'SIN EXISTENCIA' },
  ];

  constructor(private fb: FormBuilder,public storageService:StorageUserService, 
    public suppliesService:SuppliesService,
    private messageService: MessageService,private router:Router) {
    this.formAddSupply = this.fb.group({
      name: ['', [Validators.required]],
      // inventoryStatus: ['', [Validators.required]],
      description: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      // minRange: ['', [Validators.required]],
      maxRange: ['', [Validators.required]], 
      unit: ['', [Validators.required]], 
    });
  }

  ngOnInit(): void {
    this.userLocalStorage = this.storageService.getCurrentUser();
    this.img = this.storageService.getImgUser();
  }

  addSupply() {
    this.supply.description = this.formAddSupply.value.description;
    this.supply.name = this.formAddSupply.value.name;
    this.supply.amount = this.formAddSupply.value.amount;
    // this.supply.minRange = this.formAddSupply.value.minRange;
    this.supply.maxRange = this.formAddSupply.value.maxRange;
    this.supply.unit = this.formAddSupply.value.unit;
    // this.supply.inventoryStatus = this.formAddSupply.value.inventoryStatus;
    
    // console.log(this.supply);
    
    this.suppliesService.createSupply(this.supply).subscribe((data) => {
      if (data.message === 'Supply create sucessfull') {
        this.messageService.add({
          severity: 'success',
          summary: 'Creación Exitosa',
          detail: `El suministro ha sido creado con éxito`,
        });
        setTimeout(() => {
          this.router.navigate(['/supplies/home']);
        }, 2000);
      } else if (data.message == 'Supply already exists in BD') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El suministro ya ha sido registrado anteriormente',
          life: 3000,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Ocurrió un error',
          life: 3000,
        });
      }
    });
  }

  userBack() {
    this.router.navigate(['/supplies/home']);
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }
}
