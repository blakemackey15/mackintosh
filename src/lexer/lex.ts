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

    public testProgram() : string {
        let testProgram = '$';
        //Remove white spaces.
        testProgram.trim();

        //Push characters in string to token stream.
        for(let i = 0; i < testProgram.length; i++) {
            this.tokenStream.push(testProgram.charAt(i));
            //Print characters in the token stream.
            console.log(testProgram.charAt(i));
        }

        return testProgram;
    }
    //inputtedCode : string
    public lex() { 
        let code = this.testProgram();
        
        //Loop through the length of the inputted string, and check each character.
        for(let i = 0; i < code.length; i++) {
            console.log('LEXER - Lexing line ' + i + 1);
            this.tokenFlag = this.token.GenerateToken(this.tokenStream[i]);

            if(this.tokenFlag) {
                //Add current token to the token stream.
                console.log('LEXER - ' + this.token.getTokenCode() + 'Found on line: Position: ');
                this.tokenStream[i] = code.charAt(i);
                this.tokenBuffer++;
            }

            else {
                console.log('LEXER ERROR - ' + this.token.getTokenCode() + 'Found on line: Position: ');
            }
        }
    }

}