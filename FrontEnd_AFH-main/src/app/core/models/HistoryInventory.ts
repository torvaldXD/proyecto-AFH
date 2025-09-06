import { Bills } from "./Bills";
import { Employee } from "./Employes";
import { Supplies } from "./Supplies";
import { Tool } from "./Tool";

export class HistoryInventory {
    
    public _id: String;
    public provider?: String;
    public typeItem: String;
    public proyect?: String;
    public amount?: number;
    public date: String;
    public dateInside?: String;
    public dateOutside?: String;
    public type: String;
    public idBill?: String;
    public item: String;
    public dateShop: String;
    
    
    public employee?: String;

    public success: Boolean;
    public docs:HistoryInventory[];
    public message:string;
    public history!:HistoryInventory;
    public totalResults: number;
}