var mackintosh;
(function (mackintosh) {
    class lex {
        //Populate program array.
        static populateProgram(input) {
            //Clear program if it is already populated.
            program = [];
            _Functions.log('LEXER - Lexing Program ' + programCount);
            //Push characters in string to the program array.
            for (let i = 0; i < input.length; i++) {
                program.push(input.charAt(i));
            }
        }
        //inputtedCode : string
        static lex() {
            //Loop through the length of the inputted string, and check each character.
            let curToken = new mackintosh.token();
            let tokenStream = new Array('');
            tokenStream.pop();
            for (let i = 0; i < program.length; i++) {
                tokenFlag = curToken.GenerateToken(program[i], program, i);
                //Update the pointer and remove commented code.
                if (curToken.getIsComment()) {
                    let end = curToken.updateIndex();
                    program.slice(i, end);
                    i = end;
                    curToken.setIsComment(false);
                }
                //Update the pointer after finding boolop.
                if (curToken.getBoolOp()) {
                    let end2 = curToken.updateIndex();
                    program.slice(i, end2);
                    i = end2;
                    curToken.setBoolOp(false);
                }
                //Update the pointer after a keyword is found.
                for (let j = 0; j < keywords.length; j++) {
                    if (curToken.getTokenValue().toLowerCase() === keywords[j]) {
                        let end3 = curToken.updateIndex();
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
                        let isParsed = _Parser.parse(tokenStream);
                        let isSemantic;
                        if (isParsed) {
                            isSemantic = _SemanticAnalyzer.semanticAnalysis();
                        }
                        else {
                            _Functions.log("PARSER - Semantic analysis skipped due to parse errors.");
                        }
                        if (isSemantic) {
                        }
                        else {
                            _Functions.log("SEMANTIC ANALYSIS - Code generation skipped due to semantic errors.");
                        }
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
        }
    }
    mackintosh.lex = lex;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=lex.js.map