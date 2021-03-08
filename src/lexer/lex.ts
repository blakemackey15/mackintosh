import {token} from "./token";


export class lex {
    private token : token;
    private tokenBuffer : number;
    private errorCount : number;
    private tokenStream = new Array<string>("");
    private tokenFlag : boolean;
    private program = new Array<string>("");
    private tokens : Array<token>;

    constructor() {
        this.tokenBuffer = 0;
        this.errorCount = 0;
        this.token = new token;
        this.tokenFlag = false;
    }

    public testProgram(input : string) : Array<string> {
        //Remove white spaces.
        input.trim();
        this.program.pop();

        //Push characters in string to token stream.
        for(let i = 0; i < input.length; i++) {
            console.log(input.charAt(i));
            this.program.push(input.charAt(i));
        }

        return this.program;
    }
    
    //inputtedCode : string
    public lex() { 
        
        //Loop through the length of the inputted string, and check each character.
        for(let i = 0; i < this.program.length; i++) {
            console.log('LEXER - Lexing line ' + i);
            this.tokenFlag = this.token.GenerateToken(this.program[i]);

            if(this.tokenFlag) {
                //Add current token to the token stream.
                console.log('LEXER - ' + this.token.getTokenCode() + ' Found on line: Position: ');
                this.tokenBuffer++;
            }

            else {
                console.log('LEXER ERROR - ' + this.token.getTokenCode() + ' Found on line: Position: ');
            }
        }
    }

}