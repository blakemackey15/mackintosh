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
    private isToken : boolean;
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
    private quotes = new RegExp('["]');
    private quoteCount : number;

    /**
     * Tokens Needed
     * Digits 0-9
     * Characters
     * {}, +, ==. !=, "", comments
     */

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
     * Generates token by checking against the regular expressions generated.
     */
    public GenerateToken(input : string) {
        /**
         * Use switch statements to check against each RegEx.
         */
        switch(this.digits.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("DIGIT - " + input);
                this.isToken = true;
                break;
        }

        switch(this.boolOperator.test(input)) {
            case true:
                this.setTokenValue(input);
                this.isToken = true;

                if(this.tokenValue === "==") {
                    this.setTokenCode("BOOLEAN CHECK EQUAL");
                }

                else if(this.tokenValue === "!=") {
                    this.setTokenCode("BOOLEAN CHECK NOT EQUAL");
                }
                break;
        }

        switch(this.quotes.test(input)) {
            case true:
                this.setTokenValue(input);
                this.isToken = true;
                this.quoteCount++;

                if(this.quoteCount == 1) {
                    this.setTokenCode("OPEN QUOTES");
                }

                else if(this.quoteCount == 2) {
                    this.setTokenCode("CLOSED QUOTES");
                    this.quoteCount = 0;
                }
        }

        switch(this.characters.test(input)) {
            case true:
                this.setTokenValue(input);
                this.isToken = true;

                if(this.quoteCount > 0) {
                    this.setTokenCode("CHARACTER " + input);
                }

                else if(this.quoteCount == 0) {
                    this.setTokenCode("IDENTIFIER " + input);
                }
                break;
        }

        switch(this.operator.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("ADDITION OPERATOR" + input);
                this.isToken = true;
                break;
        }

        switch(this.leftBlock.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("OPENING CODE BLOCK");
                this.isToken = true;
                break;
        }

        switch(this.rightBlock.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("CLOSING CODE BLOCK");
                this.isToken = true;
                break;
        }

        switch(this.endProgram.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("END PROGRAM");
                this.isToken = true;
                break;
        }

        return this.isToken;
    }
}