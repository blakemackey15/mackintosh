module mackintosh {

    export class lex {

        //Populate program array.
        public static populateProgram(input : string) {
            //Clear program if it is already populated.
            program = [];

            _Functions.log('LEXER - Lexing Program ' + programCount);
            //Push characters in string to the program array.
            for(let i = 0; i < input.length; i++) {
                program.push(input.charAt(i));
            }
        }
        
        //inputtedCode : string
        public static lex() { 

            //Loop through the length of the inputted string, and check each character.
            let curToken = new token();
            let tokenStream = new Array<string>('');
            tokenStream.pop();
            for(let i = 0; i < program.length; i++) {
                debugger;
                tokenFlag = curToken.GenerateToken(program[i], program, i);

                //Update the pointer and remove commented code.
                if(curToken.getIsComment()) {
                    let end = curToken.updateIndex();
                    program.slice(i, end);
                    i = end;
                    curToken.setIsComment(false);
                }

                //Update the pointer after finding boolop.
                if(curToken.getBoolOp()) {
                    let end2 = curToken.updateIndex();
                    program.slice(i, end2);
                    i = end2;
                    curToken.setBoolOp(false);
                } 

                //Update the pointer after a keyword is found.
                for(let j = 0; j < keywords.length; j++) {
                    if(curToken.getTokenValue().toLowerCase() === keywords[j]) {
                        let end3 = curToken.updateIndex();
                        program.slice(i, end3);
                        i = end3;
                    }
                }

                if(tokenFlag) {
                    if(curToken.getTokenCode() != "") {
                        //Add current token to the token stream.
                        tokenIndex++;
                        _Functions.log('LEXER - ' + curToken.getTokenCode() + ' Found on line: ' + lineNum);
                        tokenStream.push(curToken.getTokenValue());
                    }
                }

                else {
                    _Functions.log('LEXER ERROR - Invalid Token ' + curToken.getTokenCode() + ' Found on line: ' + lineNum);
                    errCount++;
                }

                //Check for EOP $ and start lexing next program.
                if(program[i] == '$') {
                    if(errCount == 0) {
                        _Functions.log('LEXER - Lex Completed With ' +  errCount + ' Errors and ' + warnCount + ' Warnings');
                        _Parser.parse(tokenStream);

                        //Check if this is the end of the program. If not, begin lexing the next program.
                        if(typeof program[i] != undefined) {
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
}