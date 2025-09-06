import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Clients } from 'src/app/core/models/Clients';
import { ClientsService } from '../../services/clients.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/User';
import { StorageUserService } from 'src/app/core/services/storageuser.service';

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

  public formUpdateClient: FormGroup;
  public id: String = '';
  public client: Clients;

  userLocalStorage:User;
  
  public optionStatus =[
    { name: 'SELECCIONAR', value: null },
    { name: 'ACTIVO', value: 'ACTIVO' },
    { name: 'INACTIVO', value: 'INACTIVO' }
  ];

  constructor(
    private fb: FormBuilder,
    public storageService:StorageUserService,
    public messageService: MessageService,
    public clientsService: ClientsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.formUpdateClient = this.fb.group({
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

    this.id = String(this.activatedRoute.snapshot.queryParamMap.get('id'));

    this.clientsService.findClientById(this.id).subscribe((data) => {
      this.client = data.client;
      if (data.success === true) {
        this.formUpdateClient.patchValue({
          name: data.client.name,
          nit: data.client.nit,
          city: data.client.city,
          address: data.client.address,
          department: data.client.department,
          status: data.client.status,
        });
      }
    });
  }


  updateClient (){

    this.client.name= this.formUpdateClient.value.name;
    this.client.nit= this.formUpdateClient.value.nit;
    this.client.city= this.formUpdateClient.value.city;
    this.client.department= this.formUpdateClient.value.department;
    this.client.address= this.formUpdateClient.value.address;
    this.client.status= this.formUpdateClient.value.status;

    console.log(this.client);
    this.clientsService.updateClient(this.client._id,this.client).subscribe(
      {next: (data) => {
        if(data.message==='Client updated successfully'){
          this.messageService.add({
            severity: 'success',
            summary: 'Actualización Exitosa',
            detail: `El cliente ha sido creado con éxito`,
          });
          setTimeout(() => {
            this.router.navigate(['/clients/home']);
          }, 2000);
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

  userBack(){
    this.router.navigate(['/clients/home']);
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }
}
