import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Clients } from 'src/app/core/models/Clients';
import { ClientsService } from '../../services/clients.service';
import { User } from 'src/app/core/models/User';
import { StorageUserService } from 'src/app/core/services/storageuser.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
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
  public optionStatus =[
    { name: 'SELECCIONAR', value: null },
    { name: 'ACTIVO', value: 'ACTIVO' },
    { name: 'INACTIVO', value: 'INACTIVO' }
  ];

  public formAddClient: FormGroup;
  public client: Clients = new Clients();

  img:any;
  userLocalStorage:User;

  constructor(
    private fb: FormBuilder,public storageService:StorageUserService,
    public messageService: MessageService,
    public clientsService: ClientsService,
    private router: Router) { 

      this.formAddClient = this.fb.group({
      name: ['', [Validators.required]],
      nit: ['', [Validators.required]],
      city: ['', []],
      address: ['',[]],
      department: ['',[]],
      status: ['', []],
      });

    }

  ngOnInit(): void {
    this.userLocalStorage= this.storageService.getCurrentUser();
    this.img= this.storageService.getImgUser();
  }

  addClient(){

    this.client.name= this.formAddClient.value.name;
    this.client.nit= this.formAddClient.value.nit;
    this.client.city= this.formAddClient.value.city;
    this.client.department= this.formAddClient.value.department;
    this.client.address= this.formAddClient.value.address;
    this.client.status= this.formAddClient.value.status;

    console.log(this.client);
    

    this.clientsService.createClient(this.client).subscribe(
      {next: (data) => {
        if(data.message==='Client create sucessfull'){
          this.messageService.add({
            severity: 'success',
            summary: 'Creación Exitosa',
            detail: `El empleado ha sido creado con éxito`,
          });
          setTimeout(() => {
            this.router.navigate(['/clients/home']);
          }, 2000);
        }else if (data.message== 'The client already exists in BD'){
          this.messageService.add({
            severity:'error', 
            summary: 'Error', 
            detail: `El Empleado ${this.formAddClient.value.name} ya ha sido registrado anteriormente`, 
            life: 3000});
        }
      },
      error: () =>{
        this.messageService.add({
          severity: 'info',
          summary: 'Ocurrio algo!',
          detail: 'Por favor comuníquese con el administrador',
          life: 5000
        });
        console.log('ocurrió un error al hacer la petición')
      }}
    );
  }

  userBack() {
    this.router.navigate(['/clients/home']);
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }

}
