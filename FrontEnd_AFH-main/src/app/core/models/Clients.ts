export class Clients{
    
    public _id: String;
    public name: String;
    public nit: String;
    public city: String;
    public address: String;
    public department: String;
    public status: String;

    public success: Boolean;
    public docs:Clients[];
    public message:string;
    public client!:Clients;
    public totalResults: number;
}