var mackintosh;
(function (mackintosh) {
    var lex = /** @class */ (function () {
        function lex() {
        }
        //Populate program array.
        lex.populateProgram = function (input) {
            _Functions.log('LEXER - Lexing Program ' + programCount);
            //Remove white spaces.
            //Push characters in string to token stream.
            for (var i = 0; i < input.length; i++) {
                _Functions.log(input.charAt(i));
                program.push(input.charAt(i));
            }
        };
        //inputtedCode : string
        lex.lex = function () {
            //Loop through the length of the inputted string, and check each character.
            var curToken = new mackintosh.token();
            for (var i = 0; i < program.length; i++) {
                tokenFlag = curToken.GenerateToken(program[i], program, i);
                if (openComments.test(curToken.getTokenValue())) {
                    var end = curToken.updateIndex();
                    program.slice(i, end);
                    i = end;
                }
                for (var j = 0; j < keywords.length; j++) {
                    if (curToken.getTokenValue().toLowerCase() === keywords[j]) {
                        //this.token.setTokenValue(this.keywords[i]);
                        var end2 = curToken.updateIndex();
                        program.slice(i, end2);
                        i = end2;
                    }
                }
                if (tokenFlag) {
                    //Add current token to the token stream.
                    _Functions.log('LEXER - ' + curToken.getTokenCode() + ' Found on line: ' + lineNum);
                }
                else {
                    _Functions.log('LEXER ERROR - ' + curToken.getTokenCode() + ' Found on line: ' + lineNum);
                    errCount++;
                }
                //Check for EOP $ and start lexing next program.
                if (program[i] == '$') {
                    if (errCount == 0) {
                        _Functions.log('LEXER - Lex Completed With ' + errCount + ' Errors and ' + warnCount + ' Warnings');
                        //Check if this is the end of the program. If not, begin lexing the next program.
                        if (typeof program[i] != undefined) {
                            _Functions.log('LEXER - Lexing Program ' + programCount);
                        }
                    }
                    else {
                        _Functions.log('LEXER - Lex Failed With ' + errCount + ' Errors and ' + warnCount + ' Warnings');
                    }
                }
            }
        };
        return lex;
    }());
    mackintosh.lex = lex;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=lex.js.map