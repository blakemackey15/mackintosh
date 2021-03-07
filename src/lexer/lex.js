"use strict";
exports.__esModule = true;
exports.lex = void 0;
var token_1 = require("./token");
var lex = /** @class */ (function () {
    function lex() {
        this.tokenBuffer = 0;
        this.errorCount = 0;
        this.token = new token_1.token;
        this.tokenFlag = false;
    }
    lex.prototype.testProgram = function () {
        var testProgram = '$';
        //Remove white spaces.
        testProgram.trim();
        //Push characters in string to token stream.
        for (var i = 0; i < testProgram.length; i++) {
            this.tokenStream.push(testProgram.charAt(i));
            //Print characters in the token stream.
            console.log(testProgram.charAt(i));
        }
        return testProgram;
    };
    //inputtedCode : string
    lex.prototype.lex = function () {
        var code = this.testProgram();
        //Loop through the length of the inputted string, and check each character.
        for (var i = 0; i < code.length; i++) {
            console.log('LEXER - Lexing line ' + i + 1);
            this.tokenFlag = this.token.GenerateToken(this.tokenStream[i]);
            if (this.tokenFlag) {
                //Add current token to the token stream.
                console.log('LEXER - ' + this.token.getTokenCode() + 'Found on line: Position: ');
                this.tokenStream[i] = code.charAt(i);
                this.tokenBuffer++;
            }
            else {
                console.log('LEXER ERROR - ' + this.token.getTokenCode() + 'Found on line: Position: ');
            }
        }
    };
    return lex;
}());
exports.lex = lex;
