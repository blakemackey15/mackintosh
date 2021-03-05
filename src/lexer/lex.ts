import {token} from "./token";


export class lex {
    private token : token;
    private tokenBuffer : number;
    private errorCount : number;
    private tokenStream : Array<string>
    private tokenFlag : boolean;
    private tokens : Array<token>;

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
            console.log('LEXER - Lexing line ' + i + 1);
            this.tokenFlag = this.token.GenerateToken(this.tokenStream[i]);

            if(this.tokenFlag) {
                //Add current token to the token stream.
                console.log('LEXER - ' + this.token.getTokenCode() + 'Found on line: Position: ');
                this.tokenStream[i] = inputtedCode.charAt(i);
                this.tokenBuffer++;
            }
        }
    }

}