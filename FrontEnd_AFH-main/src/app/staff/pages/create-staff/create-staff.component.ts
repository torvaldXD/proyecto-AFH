import { Component, HostListener, OnInit,ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { ServiceStaffService } from '../../services/service-staff.service';
import { User } from 'src/app/core/models/User';
import { StorageUserService } from 'src/app/core/services/storageuser.service';


@Component({
  selector: 'app-create-staff',
  templateUrl: './create-staff.component.html',
  styleUrls: ['./create-staff.component.css'],
})
export class CreateStaffComponent implements OnInit {
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

  public formAddUser: FormGroup;

  public options:[] = [];
  public role='';

  public user: User = new User();

  img:any;
  userLocalStorage:User;

  public optionRole =[
    { name: 'SELECCIONAR', value: null },
    { name: 'ADMINISTRADOR', value: 'ADMINISTRADOR' },
    { name: 'USUARIO', value: 'USUARIO' }
  ];

  public optionArea =[
    { name: 'SELECCIONAR', value: null },
    { name: 'GERENCIA', value: 'GERENCIA' },
    { name: 'LOGISTICA', value: 'LOGISTICA' },
    { name: 'COMERCIAL', value: 'COMERCIAL' },
  ];
  
  constructor(private fb: FormBuilder,public storageService:StorageUserService, public staffService:ServiceStaffService, public auth:AuthenticationService,
    private messageService: MessageService,private router:Router) {
    
    this.formAddUser = this.fb.group({
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
      ],})
  }

  ngOnInit(): void {

    this.userLocalStorage= this.storageService.getCurrentUser();
    this.img= this.storageService.getImgUser();
  }

  addUser(){
    
    this.user.email = this.formAddUser.value.email;
    this.user.name = this.formAddUser.value.names;
    this.user.lastName = this.formAddUser.value.lastNames;
    this.user.numberPhone = this.formAddUser.value.phoneNumber;
    // this.user.role= this.formAddUser.value.role;
    this.user.role= "USUARIO";
    this.user.area= this.formAddUser.value.area;

    this.staffService.createUser(this.user).subscribe((data)=>{
      
      if(data.message==='User created successfully'){
        this.messageService.add({
          severity: 'success',
          summary: 'Creación Exitosa',
          detail: `El usuario ha sido creado con éxito`,
        });
        setTimeout(() => {
          this.router.navigate(['/staff/home']);
        }, 2000);
      }else if (data.message== 'The user already exists in the database'){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'El usuario ya ha sido registrado anteriormente', life: 3000});
      }
      else{
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrió un error', life: 3000});
      }
    })
    
  }

  userBack(){
    this.router.navigate(['/staff/home']);
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }
}
