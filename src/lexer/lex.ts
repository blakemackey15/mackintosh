module mackintosh {
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
    private keywords = new Array<string>("int", "print", "while", "string", 
    "boolean", "while", "true", "false", "if");

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
        this.program.pop();

        //Push characters in string to token stream.
        for(let i = 0; i < input.length; i++) {
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
                i = end;
            }

            for(let j = 0; j < this.keywords.length; j++) {
                if(this.token.getTokenValue().toLowerCase() === this.keywords[j]) {
                    //this.token.setTokenValue(this.keywords[i]);
                    let end2 = this.token.updateIndex();
                    this.program.slice(i, end2);
                    i = end2;
                }
            }

            //Check for new lines of code.
            if(this.program[i] === '/n') {
                this.lineNum++;
            }

            //Check for EOP $ and start lexing next program.
            if(this.program[i] == '$') {
                if(this.errorCount == 0) {
                    console.log('LEX COMPLETED WITH ' +  this.errorCount + ' ERRORS');
                }

                else {
                    console.log('LEX FAILED WITH ' + this.errorCount + ' ERRORS');
                }
            }

            else if(this.program[i] == '$' && i != this.program.length - 1) {
                console.log('LEXER - Lexing Program ' + this.programCount);
            }

            if(this.tokenFlag) {
                //Add current token to the token stream.
                console.log('LEXER - ' + this.token.getTokenCode() + ' Found on line: ' + this.lineNum);
                this.tokens.push(this.token);
                this.tokenBuffer++;
            }

            else {
                console.log('LEXER ERROR - ' + this.token.getTokenCode() + ' Found on line: ' + this.lineNum);
                this.errorCount++;
            }
        }
    }

}
}