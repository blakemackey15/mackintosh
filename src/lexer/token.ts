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
    private tokenValue : String;
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
        this.tokenCode = "";
        this.tokenValue = "";
    }

    public setTokenCode(code : string) {
        this.tokenCode = code;
    }

    public getTokenCode() {
        return this.tokenCode;
    }

    public setTokenValue(value : string) {
        this.tokenValue = value;
    }

    public getTokenValue() {
        return this.tokenValue;
    }

    /**
     * CheckTokenType: Takes an input from the user and generates a token by 
     * matching it against the regular expressions and transition tables.
     * Sets corresponding token code and returns boolean value.
     */
    public CheckTokenType(input : string) { 
        if(this.digits.test(input)) {
            this.isDigit = true;
            this.setTokenCode('Digit');
            return this.isDigit;
        }

        if(this.characters.test(input)) {
            this.isChar = true;
            this.setTokenCode('Character');
            return this.isChar
        }

        if(this.symbols.test(input)) {
            this.isSymbol = true;
            this.setTokenCode('Symbol');
            return this.isSymbol;
        }

        if(this.leftBlock.test(input)) {
            this.isLeftBlock = true;
            this.setTokenCode('Start Block');
            return this.isLeftBlock;
        }

        if(this.rightBlock.test(input)) {
            this.isRightBlock = true;
            this.setTokenCode('End Block');
            return this.isRightBlock;
        }

        if(this.operator.test(input)) {
            this.isOperator = true;
            this.setTokenCode('Operator');
            return this.isOperator;
        }

        if(this.boolOperator.test(input)) {
            this.isBoolOperator = true;
            this.setTokenCode('Boolean Operator');
            return this.isBoolOperator;
        }

        if(this.endProgram.test(input)) {
            this.isEndProgram = true;
            this.setTokenCode('End Program');
            return this.isEndProgram;
        }
    }

    /**
     * Generates token by checking against the regular expressions generated.
     */
    public GenerateToken(isTokenFlag : boolean, input : string) {
        /**
         * Use switch statements to check against each RegEx.
         */
        switch(this.digits.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("DIGIT - " + input);
                break;
        }

        switch(this.boolOperator.test(input)) {
            case true:
                this.setTokenValue(input);

                if(this.tokenValue === "==") {
                    this.setTokenCode("BOOLEAN CHECK EQUAL");
                }

                else if(this.tokenValue === "!=") {
                    this.setTokenCode("BOOLEAN CHECK NOT EQUAL");
                }
                break;
        }

        switch(this.operator.test(input)) {
            case true:
                this.setTokenValue(input);
        }

        switch(this.leftBlock.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("OPENING CODE BLOCK");
                break;
        }

        switch(this.rightBlock.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("CLOSING CODE BLOCK");
                break;
        }

        switch(this.endProgram.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("END PROGRAM");
                break;
        }
    }
}