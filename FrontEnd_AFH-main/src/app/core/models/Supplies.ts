export class Supplies {

    public _id: String;
    public inventoryStatus:string;
    public name: String;
    public description: String;
    public unit: String;
    public amount:number;
    public minRange:number;
    public maxRange:number;

    public success: Boolean;
    public docs:Supplies[];
    public message:string;
    public supply!:Supplies;
    public totalResults: number;
}