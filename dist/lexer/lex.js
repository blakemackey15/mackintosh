var mackintosh;
(function (mackintosh) {
    var lex = /** @class */ (function () {
        function lex() {
        }
        //Populate program array.
        lex.populateProgram = function (input) {
            //Clear program if it is already populated.
            program = [];
            _Functions.log('LEXER - Lexing Program ' + programCount);
            //Push characters in string to the program array.
            for (var i = 0; i < input.length; i++) {
                program.push(input.charAt(i));
            }
        };
        //inputtedCode : string
        lex.lex = function () {
            //Loop through the length of the inputted string, and check each character.
            var curToken = new mackintosh.token();
            var tokenStream = new Array('');
            tokenStream.pop();
            for (var i = 0; i < program.length; i++) {
                debugger;
                tokenFlag = curToken.GenerateToken(program[i], program, i);
                //Update the pointer and remove commented code.
                if (curToken.getIsComment()) {
                    var end = curToken.updateIndex();
                    program.slice(i, end);
                    i = end;
                    curToken.setIsComment(false);
                }
                //Update the pointer after finding boolop.
                if (curToken.getBoolOp()) {
                    var end2 = curToken.updateIndex();
                    program.slice(i, end2);
                    i = end2;
                    curToken.setBoolOp(false);
                }
                //Update the pointer after a keyword is found.
                for (var j = 0; j < keywords.length; j++) {
                    if (curToken.getTokenValue().toLowerCase() === keywords[j]) {
                        var end3 = curToken.updateIndex();
                        program.slice(i, end3);
                        i = end3;
                    }
                }
                if (tokenFlag) {
                    if (curToken.getTokenCode() != "") {
                        //Add current token to the token stream.
                        tokenIndex++;
                        _Functions.log('LEXER - ' + curToken.getTokenCode() + ' Found on line: ' + lineNum);
                        tokenStream.push(curToken.getTokenValue());
                    }
                }
                else {
                    _Functions.log('LEXER ERROR - Invalid Token ' + program[i] + ' Found on line: ' + lineNum);
                    errCount++;
                }
                curToken.setIsToken(false);
                //Check for EOP $ and start lexing next program.
                if (program[i] == '$') {
                    if (errCount == 0) {
                        _Functions.log('LEXER - Lex Completed With ' + errCount + ' Errors and ' + warnCount + ' Warnings');
                        _Parser.parse(tokenStream);
                        //Check if this is the end of the program. If not, begin lexing the next program.
                        if (typeof program[i] != undefined) {
                            _Functions.log('\n');
                            _Functions.log('\n');
                            tokenStream = [];
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