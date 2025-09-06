import { Component, HostListener, OnInit } from '@angular/core';
import { HomeService } from './service/home.service';
import { User } from '../core/models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

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

  public totalQuotes:number;
  public totalEmployees:number;
  public totalUsers:number;
  public totalClients:number;
  public totalTools:number;
  public totalSupplies:number;
  public img:any;
  public userLocalStorage:User;

  constructor(public homeService:HomeService) {}

  ngOnInit(): void {

    this.homeService.getAllEmployees().subscribe((data)=>{
      this.totalEmployees= data.docs.length;
    });

    this.homeService.getAllTools().subscribe((data)=>{
      this.totalTools= data.docs.length;
      // console.log(this.totalTools);
      
    });
    this.homeService.getAllQuotes().subscribe((data)=>{
      this.totalQuotes= data.docs.length;
      // console.log(this.totalQuotes);
      
    });
    this.homeService.getAllUsers().subscribe((data)=>{
      this.totalUsers= data.docs.length;
      // console.log(this.totalUsers);
    });
    this.homeService.getAllClients().subscribe((data)=>{
      this.totalClients= data.docs.length;
      // console.log(this.totalUsers);
    });
    this.homeService.getAllSupplies().subscribe((data)=>{
      this.totalSupplies= data.docs.length;
      // console.log(this.totalUsers);
    });

    this.userLocalStorage = this.homeService.getCurrentUser();

    this.img = this.homeService.getImgUser(); 

  }


  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }
}
