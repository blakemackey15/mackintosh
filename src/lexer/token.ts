//class that represents a single token in the lex token stream

/*
Regular expressions must be made to test inputted strings.
Tokens needed: 
Keywords: print(), while, if, int, string, boolean, false, true
Symbols: Comments, { }, ( ), ==, !=, =, $, ''
    If a character is in '', its a char/string. If it is not, it is a id.
Characters: a, b, c, space, etc.
Digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
Identifiers: 
*/

export class token {

    private tokenName : String;
    private digits = new RegExp('[0-9]');

    constructor(name: String) {
        this.tokenName = name;
    }
}