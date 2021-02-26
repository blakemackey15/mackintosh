import {token} from "./token";


export class lex {

    constructor() {

    }

    public lex() { 
        let inputCode = (<HTMLInputElement>document.getElementById('input')).value;
        return inputCode;
    }

}