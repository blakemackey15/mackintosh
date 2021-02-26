import {token} from "./token";


export class lex {
    private token : token;
    private tokenBuffer : number;
    private errorCount : number;
    private tokenStream : Array<string>
    private tokenFlag : boolean;

    constructor() {
        this.tokenBuffer = 0;
        this.errorCount = 0;
        this.token = new token;
        this.tokenFlag = false;
    }

    public lex(inputtedCode : string) { 

        /**
         * Loop through the length of the inputted string, and check each character.
         */
        for(let i = 0; i < inputtedCode.length; i++) {
            console.log('Lexing line ' + i + 1);
            this.tokenStream[i] = inputtedCode.charAt(i);
            this.tokenFlag = this.token.CheckTokenType(this.tokenStream[i]);

            
        }
    }

}