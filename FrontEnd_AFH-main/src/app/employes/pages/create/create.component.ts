import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from 'src/app/core/models/Employes';
import { EmployesService } from '../../services/employes.service';
import { MessageService } from 'primeng/api';
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

  public formAddEmployee: FormGroup;
  public employee: Employee = new Employee();

  img:any;
  userLocalStorage:User;

  constructor(
    private fb: FormBuilder,public storageService:StorageUserService,
    public messageService: MessageService,
    public employeeService: EmployesService,
    private router: Router) { 
    this.formAddEmployee = this.fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      idNumber: ['', [Validators.required,Validators.pattern("^[0-9]*$")]],
      numberPhone: ['',[]],
    });
  }

  ngOnInit(): void {
    this.userLocalStorage= this.storageService.getCurrentUser();
    this.img= this.storageService.getImgUser();
  }
  

  addEmployee(){

    this.employee.name= this.formAddEmployee.value.name;
    this.employee.lastName= this.formAddEmployee.value.lastName;
    this.employee.idNumber= this.formAddEmployee.value.idNumber;
    this.employee.numberPhone= this.formAddEmployee.value.numberPhone;

    this.employeeService.createEmployees(this.employee).subscribe((data)=>{
      
      if(data.message==='Employee create sucessfull'){
        this.messageService.add({
          severity: 'success',
          summary: 'Creación Exitosa',
          detail: `El Empleado ha sido creado con éxito`,
        });
        setTimeout(() => {
          this.router.navigate(['/employes/home']);
        }, 2000);
      }else if (data.message== 'The user already exists in BD'){
        this.messageService.add({
          severity:'error', 
          summary: 'Error', 
          detail: `El Empleado ${this.formAddEmployee.value.name} ya ha sido registrado anteriormente`, 
          life: 3000});
      }
      else{
        this.messageService.add({severity:'error', summary: 'Error Message', detail: 'Ocurrió un error', life: 3000});
      }
    });
  }

  userBack() {
    this.router.navigate(['/employes/home']);
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }
}
