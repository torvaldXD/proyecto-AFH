export class Employee {
    
    public _id: String;
    public name: String;
    public lastName: String;
    public role: string;
    public numberPhone:string;
    public idNumber:string;
    public completeName:string;

    public success: Boolean;
    public docs:Employee[];
    public message:string;
    public employee!:Employee;
    public totalResults: number;
}