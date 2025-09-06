import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuppliesService } from '../../services/supplies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Supplies } from 'src/app/core/models/Supplies';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { User } from 'src/app/core/models/User';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
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
  public formUpdateSupply: FormGroup;

  public options: [] = [];
  public value1: Number;

  public supply: Supplies = new Supplies();
  public id: String = '';

  img:any;
  userLocalStorage:User;

  public optionRole = [
    { name: 'SELECCIONAR', value: null },
    { name: 'EN EXISTENCIA', value: 'EN EXISTENCIA' },
    { name: 'POCA EXISTENCIA', value: 'POCA EXISTENCIA' },
    { name: 'SIN EXISTENCIA', value: 'SIN EXISTENCIA' },
  ];

  constructor(
    private fb: FormBuilder,public storageService:StorageUserService,
    public suppliesService: SuppliesService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formUpdateSupply = this.fb.group({
      name: ['', [Validators.required]],
      inventoryStatus: ['', [Validators.required]],
      description: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      // minRange: ['', [Validators.required]],
      maxRange: ['', [Validators.required]],
      unit: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

    this.userLocalStorage= this.storageService.getCurrentUser();
    this.img= this.storageService.getImgUser();
    this.id = String(this.activatedRoute.snapshot.queryParamMap.get('id'));

    this.suppliesService.findSupplyById(this.id).subscribe((data) => {
      this.supply = data.supply;
      if (data.success === true) {
        this.formUpdateSupply.patchValue({
          name: data.supply.name,
          inventoryStatus: data.supply.inventoryStatus,
          description: data.supply.description,
          amount: data.supply.amount,
          // minRange: data.supply.minRange,
          maxRange: data.supply.maxRange,
          unit: data.supply.unit,
        });
      }
    });
  }

  updateSupply() {
    this.supply.description = this.formUpdateSupply.value.description;
    this.supply.name = this.formUpdateSupply.value.name;
    this.supply.amount = this.formUpdateSupply.value.amount;
    this.supply.inventoryStatus = this.formUpdateSupply.value.inventoryStatus;
    this.supply.minRange = this.formUpdateSupply.value.minRange;
    this.supply.maxRange = this.formUpdateSupply.value.maxRange;
    this.supply.unit = this.formUpdateSupply.value.unit;

    // console.log(this.supply);

    this.suppliesService.updateSupply(this.supply._id,this.supply).subscribe((data) => {
      if (data.message === 'Supply updated successfully') {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizaciòn Exitosa',
          detail: `El suministro ha sido actualizado con éxito`,
        });
        setTimeout(() => {
          this.router.navigate(['/supplies/home']);
        }, 2000);
      } else if (data.message == 'Supply not found') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Ocurrio algo porfavor comunicate con el administrador',
          life: 3000,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
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

  detectValueInventory (event:any){
    if(event<1){
      this.formUpdateSupply.controls['inventoryStatus'].setValue('SIN EXISTENCIA');
    }
    if(event>1 && event<=this.supply.maxRange){
      this.formUpdateSupply.controls['inventoryStatus'].setValue('POCA EXISTENCIA');
    }
    if(event>this.supply.maxRange){
      this.formUpdateSupply.controls['inventoryStatus'].setValue('EN EXISTENCIA');
    }
  }


}
