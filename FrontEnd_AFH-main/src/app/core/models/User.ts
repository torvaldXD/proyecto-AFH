export class User {
    
    public _id: String;
    public name: String;
    public lastName: String;
    public email: String;
    public password: String;
    public verifyCode: String;
    public token: String;
    public role: string;
    public img: string;
    public area: string;
    public numberPhone:string;

    public success: Boolean;
    public docs:User[];
    public message:string;
    public user!:User;
    public totalResults: number;
}