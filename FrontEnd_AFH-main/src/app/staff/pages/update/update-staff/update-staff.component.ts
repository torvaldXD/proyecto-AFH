import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/core/models/User';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { ServiceStaffService } from 'src/app/staff/services/service-staff.service';

@Component({
  selector: 'app-update-staff',
  templateUrl: './update-staff.component.html',
  styleUrls: ['./update-staff.component.css'],
})
export class UpdateStaffComponent implements OnInit {
  public formUpdateUser: FormGroup;

  public user: User;

  optionRole: any[] = [];

  public id: String = '';

  img:any;
  userLocalStorage:User;

  public optionArea =[
    { name: 'SELECCIONAR', value: null },
    { name: 'GERENCIA', value: 'GERENCIA' },
    { name: 'LOGISTICA', value: 'LOGISTICA' },
    { name: 'COMERCIAL', value: 'COMERCIAL' },
  ];
  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public storageService:StorageUserService,
    private messageService: MessageService,
    private staffService: ServiceStaffService,
    private activatedRoute: ActivatedRoute
  ) {
    this.formUpdateUser = this.fb.group({
      names: ['', [Validators.required]],
      lastNames: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      area: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/),
        ],
      ],
    });
  }

  ngOnInit(): void {

    this.userLocalStorage= this.storageService.getCurrentUser();
    this.img= this.storageService.getImgUser();

    this.id = String(this.activatedRoute.snapshot.queryParamMap.get('id'));

    this.staffService.findUserById(this.id).subscribe((data) => {
      this.user = data.user;
      if (data.success === true) {
        this.formUpdateUser.patchValue({
          names: data.user.name,
          lastNames: data.user.lastName,
          email: data.user.email,
          area: data.user.area,
          phoneNumber: data.user.numberPhone,
        });
      }
    });

    this.optionRole = [
      { name: 'SELECCIONAR', value: null },
      { name: 'ADMINISTRADOR', value: 'ADMINISTRADOR' },
      { name: 'LOGISTICA', value: 'LOGISTICA' },
      { name: 'COMERCIAL', value: 'COMERCIAL' },
    ];
  }

  updateUser() {
    this.user.name = this.formUpdateUser.value.names;
    this.user.lastName = this.formUpdateUser.value.lastNames;
    this.user.area = this.formUpdateUser.value.area;
    this.user.numberPhone = this.formUpdateUser.value.phoneNumber;
    this.user.email = this.formUpdateUser.value.email;

    this.staffService.updateUser(this.user._id, this.user).subscribe((data) => {
      if (data.success === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualización Exitosa',
          detail: `El usuario ${this.user.name} ha sido actualizado con éxito`,
        });
        setTimeout(() => {
          this.router.navigate(['/staff']);
        }, 2000);
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
    this.router.navigate(['/staff/home']);
  }
  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }
}
