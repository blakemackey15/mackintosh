import {token} from "./token";


export class lex {
    private token : token;
    private tokenBuffer : number;
    private errorCount : number;
    private tokenStream = new Array<string>("");
    private tokenFlag : boolean;
    private program = new Array<string>("");
    private tokens : Array<token>;
    private programCount : number;
    private lineNum : number;
    private openComments = new RegExp('[\/\*]');
    private closeComments = new RegExp('[\*\/]');

    constructor() {
        this.tokenBuffer = 0;
        this.errorCount = 0;
        this.token = new token;
        this.tokenFlag = false;
        this.programCount = 1;
        this.lineNum = 1;
    }

    //Populate program array.
    public testProgram(input : string) : Array<string> {
        console.log('LEXER - Lexing Program ' + this.programCount);
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

    public getErrorCount() : number {
        return this.errorCount;
    }
    
    //inputtedCode : string
    public lex() { 
        //Loop through the length of the inputted string, and check each character.
        for(let i = 0; i < this.program.length; i++) {
            this.tokenFlag = this.token.GenerateToken(this.program[i], this.program, i);

            if(this.openComments.test(this.token.getTokenValue())) {
                let end = this.token.updateIndex();
                this.program.slice(i, end);
            }

            //Check for new lines of code.
            if(this.program[i] === '/n') {
                this.lineNum++;
            }

            //Check for EOP $ and start lexing next program.
            if(this.program[i] == '$' && i == this.program.length - 1) {
                if(this.errorCount == 0) {
                    console.log('LEX COMPLETED WITH ' +  this.errorCount);
                }

                else {
                    console.log('LEX FAILED WITH ' + this.errorCount);
                }
            }

            else if(this.program[i] == '$' && i != this.program.length - 1) {
                console.log('LEXER - Lexing Program ' + this.programCount);
            }

            if(this.tokenFlag) {
                //Add current token to the token stream.
                console.log('LEXER - ' + this.token.getTokenCode() + ' Found on line: ' + this.lineNum);
                this.tokenBuffer++;
            }

            else {
                console.log('LEXER ERROR - ' + this.token.getTokenCode() + ' Found on line: Position: ' + this.lineNum);
                this.errorCount++;
            }
        }
    }

}