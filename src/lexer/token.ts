//Class that represents a single token in the lex token stream.

/*
Regular expressions must be made to test inputted strings.
Tokens needed: 
Keywords: print(), while, if, int, string, boolean, false, true.
Symbols: Comments, { }, ( ), ==, !=, =, $, ''
    If a character is in '', its a char/string. If it is not, it is a id.
Characters: a, b, c, space, etc.
Digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.
Identifiers: 
*/
export class token {

    private tokenCode : String;
    /*
    Represents any combination of integer digits 0-9. Must match with 0 or a n
    umber beginning with any digit in range 1-9, followed by any digit.
    */
    private digits = new RegExp('[(?:0|[1-9]\d*)]');
    private characters = new RegExp('[\p{L}\s]')
    private leftBlock = new RegExp('[{]');
    private rightBlock = new RegExp('[}]');
    private operator = new RegExp('[+]');
    private boolOperator = new RegExp('[(?:^|[^!=])([!=]=)(?!=)]');
    private endProgram = new RegExp('[$]');
    private symbols = new RegExp('[-!$*()+={}\[\]"\/]')

    /**
     * Tokens Needed
     * Digits 0-9
     * {}, +, ==. !=. 
     */
    
    private isDigit : boolean;
    private isChar : boolean;
    private isSymbol : boolean;
    private isLeftBlock : boolean;
    private isRightBlock : boolean;
    private isOperator : boolean;
    private isBoolOperator : boolean;
    private isEndProgram : boolean;

    constructor() {

    }

    public setTokenCode(code : string) {
        this.tokenCode = code;
    }

    public getTokenCode() {
        return this.tokenCode;
    }

    /**
     * CheckTokenType: Takes an input from the user and generates a token by 
     * matching it against the regular expressions and transition tables.
     */
    public CheckTokenType(input : string) { 
        if(this.digits.test(input)) {
            this.isDigit = true;
            return this.isDigit;
        }

        if(this.characters.test(input)) {
            this.isChar = true;
            return this.isChar
        }

        if(this.symbols.test(input)) {
            this.isSymbol = true;
            return this.isSymbol;
        }

        if(this.leftBlock.test(input)) {
            this.isLeftBlock = true;
            return this.isLeftBlock;
        }

        if(this.rightBlock.test(input)) {
            this.isRightBlock = true;
            return this.isRightBlock;
        }

        if(this.operator.test(input)) {
            this.isOperator = true;
            return this.isOperator;
        }

        if(this.boolOperator.test(input)) {
            this.isBoolOperator = true;
            return this.isBoolOperator;
        }

        if(this.endProgram.test(input)) {
            this.isEndProgram = true;
            return this.isEndProgram;
        }
    }
}