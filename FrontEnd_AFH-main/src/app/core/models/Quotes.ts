import { Clients } from './Clients';

export class Quotes {
  public _id: String;
  public code: string;
  public project: String;
  public pay: String;
  public area: String;
  public scope: String;
  public addressedTo: String;
  public deliveryTime: String;
  public employer!: String;
  public contractor!: String;
  public creationDate!: String;

  public client: Clients;
  public items: Item[];
  public files: FilesPDF[];

  public success: Boolean;
  public docs: Quotes[];
  public message: string;
  public price!: Quotes;
  public totalResults: number;
}

export class Item {
  number: number;
  description!: string;
  unit!: string;
  unitValue!: number;
  fullValue!: number;
  amount!: number;
}

export class FilesPDF {
  rute!: string;
  creationDate!: string;
  name!: string;
  timeCreated!: string;
  clientName!: string;
}
