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

    //Token identifying information
    private tokenCode : string;
    private tokenValue : string;
    private isToken : boolean;
    private isKeyword : boolean;
    private index : number;
    private quoteCount : number;
    private buildStrings : string;

    /*
    Regular Expressions.
    */
    private digits = new RegExp('(?:0|[1-9]\d*)');
    private characters = new RegExp('^[a-zA-Z]*$');
    private leftBlock = new RegExp('[{]');
    private rightBlock = new RegExp('[}]');
    private operator = new RegExp('[+]');
    private boolOperator = new RegExp('(?:^|[^!=])([!=]=)(?!=)');
    private endProgram = new RegExp('[$]');
    private quotes = new RegExp('["]');
    private intRegEx = new RegExp('in(t)');
    private stringRegEx = new RegExp('strin(g)');
    private printRegEx = new RegExp('prin(t)');
    private falseRegEx = new RegExp('fals(e)');
    private trueRegEx = new RegExp('tru(e)');
    private ifRegEx = new RegExp('i(f)');
    private whileRegEx = new RegExp('whil(e)');
    private boolRegEx = new RegExp('boolea(n)');
    private openComments = new RegExp('[\/\*]');
    private closeComments = new RegExp('[\*\/]');

    constructor() {
        this.tokenCode = "";
        this.tokenValue = "";
        this.isKeyword = false;
        this.quoteCount = 0;
    }

    public setTokenCode(code : string) {
        this.tokenCode = code;
    }

    public getTokenCode() : string {
        return this.tokenCode;
    }

    public setTokenValue(value : string) {
        this.tokenValue = value;
    }

    public getTokenValue() : string {
        return this.tokenValue;
    }

    //Updates program array index if a comment is found.
    public updateIndex() : number {
        return this.index;
    }

    public setIsToken(isToken : boolean) {
        this.isToken = isToken;
    }

    /**
     * Generates token by checking against the regular expressions generated.
     */
    public GenerateToken(input : string, program : string[], counter : number) : boolean {
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
                    this.setTokenCode("BOOLEAN CHECK EQUAL " + input);
                }

                else if(this.tokenValue === "!=") {
                    this.setTokenCode("BOOLEAN CHECK NOT EQUAL " + input);
                }
                break;
        }

        switch(this.quotes.test(input)) {
            case true:
                this.setTokenValue(input);
                this.isToken = true;
                this.quoteCount++;

                if(this.quoteCount == 1) {
                    this.setTokenCode("OPEN QUOTES " + input);
                }

                else if(this.quoteCount == 2) {
                    this.setTokenCode("CLOSED QUOTES " + input);
                    this.quoteCount = 0;
                }
                break;
        }

        switch(this.characters.test(input)) {
            case true:
                let saveChar = new Array<String>('');
                saveChar.pop();
                saveChar.push(input);

                while(this.isKeyword != true) {
                    counter++;
                    input += program[counter];

                    switch(this.intRegEx.test(input)) {
                        case true:
                            this.setTokenValue(input);
                            this.setTokenCode("KEYWORD VAR DECLARATION " + input);
                            this.isKeyword = true;
                            this.isToken = true;
                            this.index = counter;
                            break;
                    }
            
                    switch(this.stringRegEx.test(input)) {
                        case true:
                            this.setTokenValue(input);
                            this.setTokenCode("KEYWORD VAR DECLARATION " + input);
                            this.isKeyword = true;
                            this.isToken = true;
                            this.index = counter;
                            break;
                    }
            
                    switch(this.printRegEx.test(input)) {
                        case true:
                            this.setTokenValue(input);
                            this.setTokenCode("KEYWORD PRINT STATEMENT " + input);
                            this.isKeyword = true;
                            this.isToken = true;
                            this.index = counter;
                            break;
                    }
            
                    switch(this.trueRegEx.test(input)) {
                        case true:
                            this.setTokenValue(input);
                            this.setTokenCode("BOOLEAN " + input);
                            this.isKeyword = true;
                            this.isToken = true;
                            this.index = counter;
                            break;
                    }
            
                    switch(this.falseRegEx.test(input)) {
                        case true:
                            this.setTokenValue(input);
                            this.setTokenCode("BOOLEAN " + input);
                            this.isKeyword = true;
                            this.isToken = true;
                            this.index = counter;
                            break;
                    }
            
                    switch(this.ifRegEx.test(input)) {
                        case true:
                            this.setTokenValue(input);
                            this.setTokenCode("BRANCHING STATEMENT " + input);
                            this.isKeyword = true;
                            this.isToken = true;
                            this.index = counter;
                            break;
                    }
            
                    switch(this.whileRegEx.test(input)) {
                        case true:
                            this.setTokenValue(input);
                            this.setTokenCode("WHILE KEYWORD " + input);
                            this.isKeyword = true;
                            this.isToken = true;
                            this.index = counter;
                            break;
                    }

                    switch(this.boolRegEx.test(input)) {
                        case true:
                            this.setTokenValue(input);
                            this.setTokenCode("BOOLEAN KEYWORD " + input);
                            this.isKeyword = true;
                            this.isToken = true;
                            this.index = counter;
                            break;
                    }

                    if(counter == 7 || this.isKeyword == true) {
                        break;
                    }
                }

                if(this.quoteCount > 0) {
                    this.setTokenCode("CHARACTER " + saveChar[0]);
                    this.setTokenValue(saveChar[0].toString());
                    this.isToken = true;
                }

                else if(this.quoteCount == 0 && this.isKeyword == false) {
                    this.setTokenCode("IDENTIFIER " + saveChar[0].toString());
                    this.setTokenValue(input);
                    this.isToken = true;
                }
                break;
        }

        switch(this.operator.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("ADDITION OPERATOR " + input);
                this.isToken = true;
                break;
        }

        switch(this.leftBlock.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("OPENING CODE BLOCK " + input);
                this.isToken = true;
                break;
        }

        switch(this.rightBlock.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("CLOSING CODE BLOCK " + input);
                this.isToken = true;
                break;
        }

        switch(this.endProgram.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("END PROGRAM " + input);
                this.isToken = true;
                break;
        }

        switch(this.openComments.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("OPEN COMMENT " + input);
                this.isToken = true;
                let comment = new Array<string>("");
                comment.pop();

                while(this.closeComments.test(program[counter]) != true) {
                    comment.push(program[counter]);
                    counter++;
                    this.index = counter;
                }
        }

        switch(input === '(') {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("OPEN PARENTHESIS " + input);
                this.isToken = true;
                break;
        }

        switch(input === ')') {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("CLOSE PARENTHESIS " + input);
                this.isToken = true;
                break;
        }

        if(this.isToken == false) {
            this.setTokenCode("ERROR - INVALID TOKEN " + input);
        }

        return this.isToken;
    }
}