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

    private tokenName : String;
    //Represents integer digits 0-9.
    private digits = new RegExp('[0-9]');
    //Regular expression catches all characters from any language using unicode including spaces.
    private characters = new RegExp('[\p{L}\s]')
    //Represents relevant symbols for the compiler.
    private symbols = new RegExp('[-!$*()+={}\[\]"\/]')

    constructor(name: String) {
        this.tokenName = name;
    }
}