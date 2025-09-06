import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfigurationService } from '../services/configuration.service';
import { StorageUserService } from 'src/app/core/services/storageuser.service';
import { Supplies } from 'src/app/core/models/Supplies';
import { User } from 'src/app/core/models/User';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  // styleUrls: ['./changepassword.component.css']
  styleUrls: ['../configuration.component.css']
})
export class ChangepasswordComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const sidebar = document.getElementById('sidebar');
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    if (screenWidth < 768) {
      sidebar?.classList.add('hide');
      localStorage.setItem('sidebarHidden', 'true');
    } else {
      sidebar?.classList.remove('hide');
      localStorage.setItem('sidebarHidden', 'false');
    }
  }
  public formUserChangePassword: FormGroup;
  public options: [] = [];
  public value1: Number;

  myclick:boolean = false;
  firstClick:boolean = true;
  img:any;
  public userLocalStorage:User;

  public supply: Supplies = new Supplies();

  constructor(
    private fb: FormBuilder,
    public storageService:StorageUserService,
    public configurationService: ConfigurationService,
    private messageService: MessageService,
    private router: Router
  ) {

    

    this.formUserChangePassword = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.userLocalStorage= this.storageService.getCurrentUser();
    const sidebarHidden = localStorage.getItem('sidebarHidden');
    if (sidebarHidden === 'true') {
      this.myclick = true;
      this.hideSidebar();
    }
    // const sidebar = document.getElementById('sidebar');
    // const sidebarHidden = localStorage.getItem('sidebarHidden');
    // console.log("sidebarboolean",sidebarHidden);
    

    // if (sidebarHidden === 'true') {
    //   sidebar?.classList.add('hide');
    // } else {
    //   sidebar?.classList.remove('hide');
    // }
  }
  updateUserPassword() {
    if(this.formUserChangePassword.value.newPassword !== this.formUserChangePassword.value.repeatPassword){
      this.messageService.add({
        severity: 'info',
        summary: 'Contraseña Invalida',
        detail: `Porfavor Verifica que las contraseñas coincidan`,
        life:3000
      });
      return;
    }else{
    this.configurationService.updatePassword (this.userLocalStorage._id,this.formUserChangePassword.value.currentPassword,this.formUserChangePassword.value.newPassword).subscribe(
      {
        next: (data)=>{
          // console.log(data);
          if (data.success === true && data.message=== "Password Update Successfull") {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Actualización de contraseña exitosa',
                  detail: `El usuario ${this.userLocalStorage.name} ha sido actualizado la contraseña con éxito`,
                });
                setTimeout(() => {
                  this.userBack();
                }, 3000);
          }
          if (data.success === true && data.message=== "Password Wrong") {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Verificar Información',
                  detail: `La contraseña ingresada no coincide con la registrada`,
                  life:3000
                });
          }
        },
        error:() =>{
          this.messageService.add({
            severity: 'info',
            summary: 'Ocurrió algo en el sistema',
            detail: 'Por favor comuníquese con el administrador',
            life: 5000,
          });
        },
      }
      )
    }
  }

  userBack() {
    this.router.navigate(['/configuration']);
  }
  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }

  
  // changeSidebar(event: any) {
  //   event.preventDefault();
  //   const sidebar = document.getElementById('sidebar');

  //   if (this.myclick) {
  //     this.showSidebar();
  //   } else {
  //     this.hideSidebar();
  //   }
  // }



  hideSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.add('hide');
    localStorage.setItem('sidebarHidden', 'true');
  }

  showSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.remove('hide');
    localStorage.setItem('sidebarHidden', 'false');
  }
}

