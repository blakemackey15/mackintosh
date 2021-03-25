var mackintosh;
(function (mackintosh) {
    //Class that represents parse/
    var parse = /** @class */ (function () {
        function parse() {
        }
        //Recursive descent parser implimentation.
        parse.parse = function (parseTokens) {
            _Functions.log("PARSER - Parsing Program " + programCount);
            //Check if there are tokens in the token stream.
            if (parseTokens.length <= 0) {
                _Functions.log("PARSER ERROR - There are no tokens to be parsed.");
            }
            //Begin parse.
            else {
                //Use try catch to check for parse failures and output them.
                try {
                    this.parseProgram(parseTokens);
                    _Functions.log("PARSER - Parse completed.");
                    _Functions.log(CSTTree.toString());
                }
                catch (error) {
                    _Functions.log("PARSER - Error caused parse to end.");
                }
            }
        };
        //Match function.
        parse.match = function (expectedTokens, parseToken) {
            //Check if the token is in a the expected token array.
            for (var i = 0; i < expectedTokens.length; i++) {
                if (expectedTokens[i] === parseToken) {
                    isMatch == true;
                }
            }
            if (isMatch) {
                _Functions.log("PARSER - Token Matched!" + mackintosh.token);
                CSTTree.addNode(parseToken, "leaf");
                tokenPointer++;
                CSTTree.climbTree();
            }
            else {
                _Functions.log("PARSER ERROR - Expected tokens (" + expectedTokens.toString() + ") but got "
                    + parseToken + " instead.");
                parseErrCount++;
            }
        };
        //Methods for recursive descent parser - Start symbol: program.
        //Expected tokens - block, $
        parse.parseProgram = function (parseTokens) {
            //Add the program node to the tree. This should be the root node.
            CSTTree.addNode("Program", "branch");
            //Begin parse block.
            this.parseBlock(parseTokens);
            //Check for EOP at the end of program.
            if (parseTokens[tokenPointer] == "$") {
                _Functions.log("PARSER - Program successfully parsed.");
            }
            else {
                _Functions.log("PARSER ERROR - EOP $ not found at end of program.");
                parseErrCount++;
            }
        };
        //Expected tokens: { statementList }
        parse.parseBlock = function (parseTokens) {
            CSTTree.addNode("Block", "branch");
            this.parseStatementList(parseTokens);
            CSTTree.climbTree();
        };
        //Expected tokens: statement statementList
        //OR - empty
        parse.parseStatementList = function (parseTokens) {
            //Check if the 
            if (parseTokens[tokenPointer].length != 0) {
                CSTTree.addNode("StatementList", "branch");
                this.parseStatement(parseTokens);
            }
            //Empty string - do nothing.
            else {
                //Not an empty else, represents do nothing.
            }
            CSTTree.climbTree();
        };
        //Expected tokens: print, assignment, var declaration, while, if, block
        parse.parseStatement = function (parseTokens) {
            CSTTree.addNode("Statement", "branch");
            //Use regular expressions from lex to check what type of statement is to be parsed.
            if (printRegEx.test(parseTokens[tokenPointer])) {
                this.parsePrintStatement(parseTokens);
            }
            //Check for assignment op.
            if (assignment.test(parseTokens[tokenPointer])) {
                this.parseAssignmentStatement(parseTokens);
            }
            //Check for var declaration types - boolean, int, string.
            if (boolRegEx.test(parseTokens[tokenPointer]) || stringRegEx.test(parseTokens[tokenPointer])
                || intRegEx.test(parseTokens[tokenPointer])) {
                this.parseVarDecl(parseTokens);
            }
            //Check for while statement.
            if (whileRegEx.test(parseTokens[tokenPointer])) {
                this.parseWhileStatement(parseTokens);
            }
            //Check for if statement.
            if (ifRegEx.test(parseTokens[tokenPointer])) {
                this.parseIfStatement(parseTokens);
            }
            //Check for opening or closing block.
            if (leftBlock.test(parseTokens[tokenPointer]) || rightBlock.test(parseTokens[tokenPointer])) {
                this.parseBlock(parseTokens);
            }
            CSTTree.climbTree();
        };
        //Expected tokens: print( expr )
        parse.parsePrintStatement = function (parseTokens) {
            CSTTree.addNode("PrintStatement", "branch");
            this.parseExpr(parseTokens);
            CSTTree.climbTree();
        };
        //Expected tokens: id = expr
        parse.parseAssignmentStatement = function (parseTokens) {
            CSTTree.addNode("AssignmentStatement", "branch");
            CSTTree.climbTree();
        };
        //Expected tokens: type id
        parse.parseVarDecl = function (parseTokens) {
            CSTTree.addNode("VarDecl", "branch");
            CSTTree.climbTree();
        };
        //Expected tokens: while boolexpr block
        parse.parseWhileStatement = function (parseTokens) {
            CSTTree.addNode("WhileStatement", "branch");
            CSTTree.climbTree();
        };
        //Expected tokens: if boolexpr block
        parse.parseIfStatement = function (parseTokens) {
            CSTTree.addNode("IfStatement", "branch");
            CSTTree.climbTree();
        };
        //Expected tokens: intexpr, stringexpr, boolexpr, id
        parse.parseExpr = function (parseTokens) {
            CSTTree.addNode("Expr", "branch");
            //Check what type of expr this token is.
            if (digits.test(parseTokens[tokenPointer])) {
                this.parseIntExpr(parseTokens);
            }
            //Check if there are more than 1 character - that means its a string and not an id. 
            if (characters.test(parseTokens[tokenPointer]) && parseTokens[tokenPointer].length != 0) {
                //Checks if the input value is true or false.
                if (trueRegEx.test(parseTokens[tokenPointer]) || falseRegEx.test(parseTokens[tokenPointer])) {
                    this.parseBoolExpr(parseTokens);
                }
                //If not, then its a string.
                else {
                    this.parseStringExpr(parseTokens);
                }
            }
            //This handles if its an id.
            if (characters.test(parseTokens[tokenPointer]) && parseTokens[tokenPointer].length == 0) {
                this.parseId(parseTokens);
            }
            CSTTree.climbTree();
        };
        //Expected tokens: digit intop expr
        //OR: digit
        parse.parseIntExpr = function (parseTokens) {
        };
        //Expected tokens: "charlist"
        parse.parseStringExpr = function (parseTokens) {
            CSTTree.addNode("StringExpr", "branch");
            this.parseCharList(parseTokens);
            CSTTree.climbTree();
        };
        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        parse.parseBoolExpr = function (parseTokens) {
        };
        //Expected tokens: char
        parse.parseId = function (parseTokens) {
            CSTTree.addNode("Id", "branch");
            this.parseChar(parseTokens);
            CSTTree.climbTree();
        };
        //Expected tokens: char charlist, space charlist, empty
        parse.parseCharList = function (parseTokens) {
            CSTTree.addNode("CharList", "branch");
            if (parseTokens[tokenPointer] === " ") {
                this.parseSpace(parseTokens);
            }
            else if (parseTokens[tokenPointer].length > 1) {
            }
            // else {
            //     //Not an empty else, represents do nothing.
            // }
            CSTTree.climbTree();
        };
        //Expected tokens: int, string, boolean
        parse.parseType = function (parseTokens) {
            CSTTree.addNode("Type", "leaf");
            this.match(["int", "string", "boolean"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        };
        //Expected tokens: a-z
        parse.parseChar = function (parseTokens) {
            CSTTree.addNode("Char", "leaf");
            this.match(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
                "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
                "y", "z"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        };
        //Expected tokens: space
        parse.parseSpace = function (parseTokens) {
            CSTTree.addNode("Space", "leaf");
            this.match([" "], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        };
        //Expected tokens: 0-9
        parse.parseDigit = function (parseTokens) {
            CSTTree.addNode("Digit", "leaf");
            this.match(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        };
        //Expected tokens: ==, !=
        parse.parseBoolOp = function (parseTokens) {
            CSTTree.addNode("BoolOp", "leaf");
            this.match(["==", "!="], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        };
        //Expected tokens: false, true
        parse.parseBoolVal = function (parseTokens) {
            CSTTree.addNode("BoolVal", "leaf");
            this.match(["false", "true"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        };
        //Expected tokens: +
        parse.parseIntOp = function (parseTokens) {
            CSTTree.addNode("IntOp", "leaf");
            this.match(["+"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        };
        return parse;
    }());
    mackintosh.parse = parse;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=parse.js.map