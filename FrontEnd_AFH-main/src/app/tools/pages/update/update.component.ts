import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToolsService } from '../../services/Tool.service';
import { Tool } from 'src/app/core/models/Tool';
import { FileUpload } from 'primeng/fileupload';
import { Files } from 'src/app/core/models/Files';
import { Codes } from 'src/app/core/models/Codes';
import * as moment from 'moment';
import { Employee } from 'src/app/core/models/Employes';
import { User } from 'src/app/core/models/User';
import { StorageUserService } from 'src/app/core/services/storageuser.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  @ViewChild('fileInput') fileUpload!: FileUpload;
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

  public uploadedFiles: any[] = [];

  private archivo!: Files;
  public archivos: any[] = [];
  public uplo!: File;

  public tool: Tool;
  public subio: boolean = false;
  public listCodes: Codes[];
  public id: String = '';
  public idCodeBefore:string='';

  public path: string='';
  public pathBefore: string='';
  public dateBefore1:Date;
  public dateBefore2:Date;
  public imgPath='';
  resultsEmployees: Employee[]=[];

  public formUpdateTool: FormGroup;

  img:any;
  userLocalStorage:User;  

  public optionStatus = [
    { name: 'SELECCIONAR', value: null },
    { name: 'ACTIVA', value: 'ACTIVA' },
    { name: 'OCUPADA', value: 'OCUPADA' },
    { name: 'INACTIVA' , value: 'INACTIVA' }
  ];

  constructor(
    private fb: FormBuilder,public storageService:StorageUserService,
    public toolsService: ToolsService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formUpdateTool = this.fb.group({
      name: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      codeGenerate: ['', [Validators.required]],
      inCharge: ['',[]],
      status: ['',[]],
      departureDate: [null,[]],
      admissionDate: [null,[]],
    });
  }

  ngOnInit(): void {

    this.userLocalStorage= this.storageService.getCurrentUser();
    this.img= this.storageService.getImgUser();

    this.id = String(this.activatedRoute.snapshot.queryParamMap.get('id'));

    this.toolsService.findToolById(this.id).subscribe((data) => {
      this.tool = data.tool;
      // this.formUpdateTool.get('status')?.setValue(this.tool.status);
      // this.formUpdateTool.controls['status'].setValue('INACTIVA');
      // this.formUpdateTool.controls['status'].setValue(data.tool.status);
      this.imgPath = 'http://localhost:2009/public/storage/archivos/Tools/'+ data.tool.image;
      if (data.success === true) {
        const departureDate = moment(data.tool.departureDate, 'DD/MM/YYYY');
        const departureDateValue = departureDate.isValid() ? departureDate.toDate() : null;
        const admissionDate = moment(data.tool.admissionDate, 'DD/MM/YYYY');
        const admissionDateValue = admissionDate.isValid() ? admissionDate.toDate() : null;
        
        this.idCodeBefore=this.tool.codeTool;
        this.pathBefore=this.tool.image;
        this.formUpdateTool.patchValue({
          name: data.tool.name,
          brand: data.tool.brand,
          codeGenerate: data.tool.codeTool,
          status: data.tool.status,
          inCharge: data.tool.inCharge,
          admissionDate: admissionDateValue,
          departureDate: departureDateValue,
        });
      }      
    });
    
    
  }
  

  updateTool() {    
    //Validaciones
    if(this.subio===true){
      this.tool.image = this.path;
    }if(this.subio===false){
      this.tool.image = this.pathBefore;
    }
    if (this.formUpdateTool.value.admissionDate  !== null && this.formUpdateTool.value.departureDate !== null){
      if(this.formUpdateTool.value.inCharge === ''){
        this.messageService.add({
          severity: 'warn',
          summary: 'Verificación de información',
          detail: `Porfavor ingrese el encargado de la herramienta`,
        });
        return;
      }
    }
    if(this.formUpdateTool.value.admissionDate  !== null && this.formUpdateTool.value.departureDate === null){
      this.messageService.add({
        severity: 'warn',
        summary: 'Verificación de información',
        detail: `Porfavor ingrese la fecha de salida`,
      });
      return;
    }
    if(this.formUpdateTool.value.admissionDate  === null && this.formUpdateTool.value.departureDate !== null){
      this.messageService.add({
        severity: 'warn',
        summary: 'Verificación de información',
        detail: `Porfavor ingrese la fecha de ingreso`,
      });
      return;
    }
      
    // }else if((this.formUpdateTool.value.admissionDate===null && this.formUpdateTool.value.departureDate===null && this.formUpdateTool.value.inCharge === '') ){
    //   this.tool.status = this.formUpdateTool.value.status ;
    // }
    // else if((this.formUpdateTool.value.admissionDate===null && this.formUpdateTool.value.departureDate===null && this.formUpdateTool.value.inCharge === '') || this.tool.status === "OCUPADA" || this.tool.status === "ACTIVA" || this.tool.status === "INACTIVA" ){
    //   // this.formUpdateTool.controls['status'].setValue("ACTIVA");
    //   this.formUpdateTool.controls['inCharge'].setValue("");
    //   this.tool.status = "ACTIVA";
    // }

    const fechaFormateadaAdmission = moment(this.formUpdateTool.value.admissionDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    const fechaFormateadaDeparture = moment(this.formUpdateTool.value.departureDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    this.tool.name = this.formUpdateTool.value.name;
    this.tool.brand = this.formUpdateTool.value.brand;
    this.tool.codeTool = this.formUpdateTool.value.codeGenerate;
    this.tool.status = this.formUpdateTool.value.status;
    this.tool.inCharge = this.formUpdateTool.value.inCharge;
    this.tool.departureDate = fechaFormateadaDeparture;
    this.tool.admissionDate = fechaFormateadaAdmission;

    // console.log("antes de enviar", this.tool);
    this.toolsService.updateTool(this.tool._id,this.tool).subscribe((data)=>{
      if(data.success===true){
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizacón Exitosa',
          detail: `La herramienta ha sido actualizada con éxito`,
        });
        if (this.subio) {
          this.fileUpload.upload();
        }
        this.formUpdateTool.reset();
        setTimeout(() => {
          this.router.navigate(['/tools/home']);
        }, 2000);
      }else{
        this.messageService.add({severity:'error', summary: 'Error Message', detail: 'Ocurrió un error', life: 3000});
      }
    })
  }

  userBack() {
    this.router.navigate(['/tools/home']);
  }

  changeStatus(event:any){
    console.log(event.value);
    if(event.value==="INACTIVA"){
      // this.tool.status = "INACTIVA";
      // this.formUpdateTool.controls['status'].setValue("INACTIVA");
    }
    if(event.value==="ACTIVA"){
      this.formUpdateTool.controls['inCharge'].setValue("");
      this.formUpdateTool.controls['admissionDate'].setValue(null);
      this.formUpdateTool.controls['departureDate'].setValue(null);
    }
    if(event.value==="OCUPADA"){
      if(this.formUpdateTool.value.admissionDate  === null || this.formUpdateTool.value.departureDate === null || this.formUpdateTool.value.inCharge === ''){
        this.messageService.add({
          severity: 'warn',
          summary: 'Verificación de información',
          detail: `Porfavor ingrese la información necesaria (fecha de salida, fecha de ingreso y encargado)`,
          life:4000
        });
        // this.formUpdateTool.controls['status'].setValue(this.tool.status);
      }
    } 
  }

  changeOptionStatus(event:any){
    this.formUpdateTool.controls['status'].setValue("OCUPADA");
    if(!event){
      this.formUpdateTool.controls['status'].setValue("ACTIVA");
    }
  }

  findEmployee(event:any){
    this.toolsService.findByAutoComplete(event.query).subscribe((data) => {
      this.resultsEmployees = data.docs;
    });
  }

  //upload Files
  onUpload() {
    this.uploadedFiles = [];
    this.fileUpload.clear();
    this.archivos = [];
  }

  fileSelect(event: any) {
    this.subio = true;
    this.path = `${this.formUpdateTool.value.codeGenerate}/${event.currentFiles[0].name}`;
    // console.log(this.path);
  }

  onUploadFile(event: any): void {
    for (const file of event.files) {
      this.archivos.push(file);
    }
    let pathDelete = 'public/storage/archivos/Tools/'+this.pathBefore;
    this.archivo = new Files();
    this.archivo.titulo = `Img${moment(new Date()).format('YYYY-MM-DD')}`;
    this.archivo.idObjeto = this.formUpdateTool.value.codeGenerate;
    this.archivo.dir = 'Tools' + '/' + this.formUpdateTool.value.codeGenerate;
    this.archivo.codeTool = this.tool.codeTool;
    this.toolsService.updateUploads(this.archivo, this.archivos,pathDelete).subscribe((data) => {
      if (data.message === 'Operación exitosa') {
        this.messageService.add({
          severity: 'success',
          summary: 'Operación exitosa!',
          detail: 'Archivos subidos',
        });
        this.fileUpload.clear();
        this.uploadedFiles = [];
        this.archivos = [];
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error inesperado',
          detail: '',
        });
        this.uploadedFiles = [];
        this.fileUpload.clear();
        this.archivos = [];
      }
    });
  }

  clear() {
    // console.log(this.path);
    this.uploadedFiles = [];
    this.subio = false;
    this.path = '';
  }
  remove(event: any) {
    this.uploadedFiles = [];
    this.subio = false;
    this.path = '';
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }
}
