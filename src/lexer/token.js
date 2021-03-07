"use strict";
//Class that represents a single token in the lex token stream.
exports.__esModule = true;
exports.token = void 0;
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
var token = /** @class */ (function () {
    /**
     * Tokens Needed
     * Digits 0-9
     * Characters
     * {}, +, ==. !=, "", comments
     */
    function token() {
        /*
        Represents any combination of integer digits 0-9. Must match with 0 or a n
        umber beginning with any digit in range 1-9, followed by any digit.
        */
        this.digits = new RegExp('[(?:0|[1-9]\d*)]');
        this.characters = new RegExp('[\p{L}\s]');
        this.leftBlock = new RegExp('[{]');
        this.rightBlock = new RegExp('[}]');
        this.operator = new RegExp('[+]');
        this.boolOperator = new RegExp('[(?:^|[^!=])([!=]=)(?!=)]');
        this.endProgram = new RegExp('[$]');
        this.quotes = new RegExp('["]');
        this.intRegEx = new RegExp('in(t)');
        this.stringRegEx = new RegExp('strin(g)');
        this.printRegEx = new RegExp('prin(t)');
        this.falseRegEx = new RegExp('fals(e)');
        this.trueRegEx = new RegExp('tru(e)');
        this.ifRegEx = new RegExp('i(f)');
        this.whileRegEx = new RegExp('whil(e)');
        this.tokenCode = "";
        this.tokenValue = "";
    }
    token.prototype.setTokenCode = function (code) {
        this.tokenCode = code;
    };
    token.prototype.getTokenCode = function () {
        return this.tokenCode;
    };
    token.prototype.setTokenValue = function (value) {
        this.tokenValue = value;
    };
    token.prototype.getTokenValue = function () {
        return this.tokenValue;
    };
    /**
     * Generates token by checking against the regular expressions generated.
     */
    token.prototype.GenerateToken = function (input) {
        /**
         * Use switch statements to check against each RegEx.
         */
        switch (this.digits.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("DIGIT - " + input);
                this.isToken = true;
                break;
        }
        switch (this.boolOperator.test(input)) {
            case true:
                this.setTokenValue(input);
                this.isToken = true;
                if (this.tokenValue === "==") {
                    this.setTokenCode("BOOLEAN CHECK EQUAL ");
                }
                else if (this.tokenValue === "!=") {
                    this.setTokenCode("BOOLEAN CHECK NOT EQUAL ");
                }
                break;
        }
        switch (this.quotes.test(input)) {
            case true:
                this.setTokenValue(input);
                this.isToken = true;
                this.quoteCount++;
                if (this.quoteCount == 1) {
                    this.setTokenCode("OPEN QUOTES ");
                }
                else if (this.quoteCount == 2) {
                    this.setTokenCode("CLOSED QUOTES ");
                    this.quoteCount = 0;
                }
        }
        switch (this.characters.test(input)) {
            case true:
                this.setTokenValue(input);
                this.isToken = true;
                if (this.quoteCount > 0) {
                    this.setTokenCode("CHARACTER " + input);
                }
                else if (this.quoteCount == 0) {
                    this.setTokenCode("IDENTIFIER " + input);
                }
                break;
        }
        switch (this.operator.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("ADDITION OPERATOR " + input);
                this.isToken = true;
                break;
        }
        switch (this.leftBlock.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("OPENING CODE BLOCK ");
                this.isToken = true;
                break;
        }
        switch (this.rightBlock.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("CLOSING CODE BLOCK ");
                this.isToken = true;
                break;
        }
        switch (this.endProgram.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("END PROGRAM");
                this.isToken = true;
                break;
        }
        switch (this.intRegEx.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("KEYWORD VAR DECLARATION " + input);
                this.isToken = true;
                break;
        }
        switch (this.stringRegEx.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("KEYWORD VAR DECLARATION " + input);
                this.isToken = true;
                break;
        }
        switch (this.printRegEx.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("KEYWORD PRINT STATEMENT " + input);
                this.isToken = true;
                break;
        }
        switch (this.trueRegEx.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("BOOLEAN " + input);
                this.isToken = true;
                break;
        }
        switch (this.falseRegEx.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("BOOLEAN " + input);
                this.isToken = true;
                break;
        }
        switch (this.ifRegEx.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("BRANCHING STATEMENT " + input);
                this.isToken = true;
                break;
        }
        switch (this.whileRegEx.test(input)) {
            case true:
                this.setTokenValue(input);
                this.setTokenCode("");
                this.isToken = true;
                break;
        }
        if (this.isToken == false) {
            this.setTokenCode("ERROR - INVALID TOKEN " + input);
        }
        return this.isToken;
    };
    return token;
}());
exports.token = token;
