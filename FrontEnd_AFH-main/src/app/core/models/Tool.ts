import { Employee } from "./Employes";

export class Tool {

    public _id: string;
    public brand:string;
    public name:string;
    public registrationDate: string;
    public codeTool: string;
    public image:string;
    public status:string;
    public departureDate:string;
    public admissionDate:string;
    public inCharge:Employee;
    
    public success: Boolean;
    public docs:Tool[];
    public message:string;
    public tool!:Tool;
    public totalResults: number;
}