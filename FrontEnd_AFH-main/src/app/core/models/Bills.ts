export class Bills {
    
    public _id: String;
    public provider: String;
    public idBill: String;
    public price: number;
    public vat: String;
    public retention?: String;
    public dateShop: String;
    public total!: number;

    public success: Boolean;
    public docs:Bills[];
    public message:string;
    public bill!:Bills;
    public totalResults: number;
}