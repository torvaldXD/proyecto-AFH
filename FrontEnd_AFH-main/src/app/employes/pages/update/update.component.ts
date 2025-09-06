import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EmployesService } from '../../services/employes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/core/models/Employes';
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
  public formUpdateEmployee: FormGroup;
  public id: String = '';
  public employee: Employee;

  img:any;
  userLocalStorage:User;

  constructor(
    private fb: FormBuilder,public storageService:StorageUserService,
    public messageService: MessageService,
    public employeeService: EmployesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.formUpdateEmployee = this.fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      idNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      phoneNumber: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

    this.userLocalStorage= this.storageService.getCurrentUser();
    this.img= this.storageService.getImgUser();
    this.id = String(this.activatedRoute.snapshot.queryParamMap.get('id'));

    this.employeeService.findEmployeeById(this.id).subscribe((data) => {
      this.employee = data.employee;
      if (data.success === true) {
        this.formUpdateEmployee.patchValue({
          name: data.employee.name,
          lastName: data.employee.lastName,
          phoneNumber: data.employee.numberPhone,
          idNumber: data.employee.idNumber,
        });
      }
    });
  }

  updateEmployee() {
    this.employee.name = this.formUpdateEmployee.value.name;
    this.employee.lastName = this.formUpdateEmployee.value.lastName;
    this.employee.numberPhone = this.formUpdateEmployee.value.phoneNumber;
    this.employee.idNumber = this.formUpdateEmployee.value.idNumber;
    
    this.employeeService
      .updateEmployee(this.employee._id, this.employee)
      .subscribe((data) => {
        if (data.success === true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualización Exitosa',
            detail: `El Empleado ${this.employee.name} ha sido actualizado con éxito`,
          });
          setTimeout(() => {
            this.router.navigate(['/employes/home']);
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
    this.router.navigate(['/employes/home']);
  }


  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }
}
