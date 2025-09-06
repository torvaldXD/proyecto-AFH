import { Component, HostListener, OnInit } from '@angular/core';
import { Supplies } from '../core/models/Supplies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfigurationService } from './services/configuration.service';
import { User } from '../core/models/User';
import { StorageUserService } from '../core/services/storageuser.service';
import { RouteInfo, MenuItems1} from '../core/shared/navData';


// declare interface RouteInfo {
//   path: string;
//   title: string;
//   icon: string;
//   // role: string;
//   condition?: any;
// }
@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements OnInit {
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
  public formUserConfiguration: FormGroup;
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

    

    this.formUserConfiguration = this.fb.group({
      names: ['', [Validators.required]],
      lastNames: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['',[Validators.required,Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)]],
    });
  }

  ngOnInit(): void {
    this.userLocalStorage= this.storageService.getCurrentUser();
    this.img= this.storageService.getImgUser();

    this.configurationService.findUserById(this.userLocalStorage._id).subscribe(data=>{
      if (data.success === true) {
        this.formUserConfiguration.patchValue({
          names: data.user.name,
          lastNames: data.user.lastName,
          email: data.user.email,
          phoneNumber: data.user.numberPhone,
        });
      }
    })

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
  updateUserConfiguration() {
    console.log(this.userLocalStorage);
    
    this.userLocalStorage.name = this.formUserConfiguration.value.names;
    this.userLocalStorage.lastName = this.formUserConfiguration.value.lastNames;
    this.userLocalStorage.numberPhone = this.formUserConfiguration.value.phoneNumber;
    this.userLocalStorage.email = this.formUserConfiguration.value.email;

    this.configurationService.updateUser(this.userLocalStorage._id, this.userLocalStorage).subscribe((data) => {
      if (data.success === true) {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualización Exitosa',
          detail: `El usuario ${this.userLocalStorage.name} ha sido actualizado con éxito`,
        });
        setTimeout(() => {
          this.router.navigate(['/configuration']);
        }, 2000);
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
    this.router.navigate(['/home']);
  }
  userChangePassword() {
    this.router.navigate(['configuration/changePassword']);
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
