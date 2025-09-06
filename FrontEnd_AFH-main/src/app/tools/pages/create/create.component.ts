import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToolsService } from '../../services/Tool.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Tool } from 'src/app/core/models/Tool';
import { FileUpload } from 'primeng/fileupload';
import { Files } from 'src/app/core/models/Files';
import * as moment from 'moment';
import { Codes } from 'src/app/core/models/Codes';
import { User } from 'src/app/core/models/User';
import { StorageUserService } from 'src/app/core/services/storageuser.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
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

  public formAddTool: FormGroup;

  public uploadedFiles: any[] = [];

  private archivo!: Files;

  public archivos: any[] = [];
  public uplo!: File;

  public tool: Tool;
  public subio: boolean = false;
  public listCodes: Codes[];
  public path: string;

  img:any;
  userLocalStorage:User;

  constructor(
    private fb: FormBuilder,public storageService:StorageUserService,
    public toolsService: ToolsService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formAddTool = this.fb.group({
      name: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      description: ['', []],
      codeGenerate: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.userLocalStorage= this.storageService.getCurrentUser();
    this.img= this.storageService.getImgUser();

    this.toolsService.getAllCodes().subscribe((data) => {
      this.listCodes = [...data.docs];
    });

    this.tool = new Tool();
  }

  generateCode(event: any) {
    let ds = this.generateCodeString(event.target.value);
    this.formAddTool.controls['codeGenerate'].setValue(ds);
  }

  addTool() {
    if (!this.subio) {
      this.path = 'static/tool.png';
    }
    this.tool.codeTool = this.formAddTool.value.codeGenerate;
    this.tool.name = this.formAddTool.value.name;
    this.tool.brand = this.formAddTool.value.brand;
    this.tool.image = this.path;

    this.toolsService.createTool(this.tool).subscribe((data) => {
      if (data.message === 'Tool create sucessfull') {
        this.messageService.add({
          severity: 'success',
          summary: 'Herramienta Agregada',
          detail: `La Herramienta ha sido creada con éxito`,
        });
        if (this.subio) {
          this.fileUpload.upload();
        }
        this.formAddTool.reset();
        setTimeout(() => {
          this.router.navigate(['tools/home']);
        }, 2500);
      } else if (data.message == 'Tool already exists in BD') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'La Herramienta ya ha sido registrada anteriormente',
          life: 2000,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Ocurrió un error',
          life: 2000,
        });
      }
    });
  }

  onUploadFile(event: any): void {
    for (const file of event.files) {
      this.archivos.push(file);
    }

    this.archivo = new Files();
    this.archivo.titulo = `Img${moment(new Date()).format('YYYY-MM-DD')}`;
    this.archivo.idObjeto = this.formAddTool.value.codeGenerate;
    this.archivo.dir = 'Tools' + '/' + this.formAddTool.value.codeGenerate;
    this.archivo.codeTool = this.tool.codeTool;
    this.toolsService.uploads(this.archivo, this.archivos).subscribe((data) => {
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

  userBack() {
    this.router.navigate(['/tools/home']);
  }

  verifyNumber(num: number) {
    let newNumber;
    for (let index = 0; index < 10; index++) {
      if (num < 10) {
        newNumber = '0' + num;
      } else {
        newNumber = num;
      }
    }
    return newNumber;
  }

  generateCodeString(str: string) {
    let numero = 1;
    let separate = str.split(' ');
    let code = '';

    let wordswithD = separate.filter((word) => word.toLowerCase() !== 'de');

    let inicial1, inicial2, inicial3, inicial4;

    if (wordswithD.length === 1) {
      inicial1 = wordswithD[0].charAt(0).toLocaleUpperCase();
      code = `${inicial1}-${this.verifyNumber(numero)}`;
    }
    if (wordswithD.length === 2) {
      inicial1 = wordswithD[0].charAt(0).toLocaleUpperCase();
      inicial2 = wordswithD[1].charAt(0).toLocaleUpperCase();
      code = `${inicial1}${inicial2}-${this.verifyNumber(numero)}`;
    }
    if (wordswithD.length === 3) {
      inicial1 = wordswithD[0].charAt(0).toLocaleUpperCase();
      inicial2 = wordswithD[1].charAt(0).toLocaleUpperCase();
      inicial3 = wordswithD[2].charAt(0).toLocaleUpperCase();
      code = `${inicial1}${inicial2}${inicial3}-${this.verifyNumber(numero)}`;
    }
    if (wordswithD.length === 4) {
      inicial1 = wordswithD[0].charAt(0).toLocaleUpperCase();
      inicial2 = wordswithD[1].charAt(0).toLocaleUpperCase();
      inicial3 = wordswithD[2].charAt(0).toLocaleUpperCase();
      inicial4 = wordswithD[3].charAt(0).toLocaleUpperCase();
      code = `${inicial1}${inicial2}${inicial3}${inicial4}-${this.verifyNumber(
        numero
      )}`;
    }

    while (this.listCodes.some((element) => element.code === code)) {
      numero++;
      if (separate.length === 1) {
        code = `${inicial1}-${this.verifyNumber(numero)}`;
      }
      if (separate.length === 2) {
        code = `${inicial1}${inicial2}-${this.verifyNumber(numero)}`;
      }
      if (separate.length === 3) {
        code = `${inicial1}${inicial2}${inicial3}-${this.verifyNumber(numero)}`;
      }
      if (separate.length === 4) {
        code = `${inicial1}${inicial2}${inicial3}${inicial4}-${this.verifyNumber(
          numero
        )}`;
      }
    }

    return code;
  }

  //upload Files
  onUpload() {
    this.uploadedFiles = [];
    this.fileUpload.clear();
    this.archivos = [];
  }

  fileSelect(event: any) {
    this.subio = true;
    this.path = `${this.formAddTool.value.codeGenerate}/${event.currentFiles[0].name}`;
  }

  clear() {
    this.uploadedFiles = [];
    this.path = 'static/tool.png';
    this.subio = false;
  }
  remove(event: any) {
    this.uploadedFiles = [];
    this.subio = false;
    this.path = 'static/tool.png';
  }

  changeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hide');
  }
}
