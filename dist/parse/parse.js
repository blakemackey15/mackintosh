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
                    return CSTTree.getRoot();
                }
                catch (error) {
                    _Functions.log("PARSER - Error caused parse to end.");
                }
            }
        };
        //Match function.
        parse.match = function (tokens) {
            //Check if the token is in a the expected token array.
            for (var i = 0; i < expectedTokens.length; i++) {
                if (expectedTokens[i].getTokenValue() == tokens[i]) {
                    isMatch == true;
                }
            }
            if (isMatch) {
                _Functions.log("PARSER - Token Matched!" + mackintosh.token);
                //TODO: Check if this is a leaf or branch node.
                CSTTree.addNode(curToken.getTokenValue(), "");
                CSTTree.climbTree();
            }
            else {
                _Functions.log("PARSER ERROR - Expected tokens (" + expectedTokens.toString() + ") but got "
                    + mackintosh.token + " instead.");
                parseErrCount++;
            }
        };
        //Methods for recursive descent parser - Start symbol: program.
        //Expected tokens - block, $
        parse.parseProgram = function (parseTokens) {
            //Add the program node to the tree. This should be the root node.
            CSTTree.addNode("Program", "branch");
            //Begin parse block.
            this.parseBlock();
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
        parse.parseBlock = function () {
            CSTTree.addNode("Block", "branch");
            this.parseStatementList();
        };
        //Expected tokens: statement statementList
        //OR - empty
        parse.parseStatementList = function () {
            // CSTTree.addNode("StatementList", "branch");
            // this.parseStatement(parseTokens);
            // this.parseStatementList(parseTokens);
            //if(){
            //}
            //else {
            //Not an empty else, represents do nothing.
            //}
        };
        //Expected tokens: print, assignment, var declaration, while, if, block
        parse.parseStatement = function () {
        };
        //Expected tokens: print( expr )
        parse.parsePrintStatement = function () {
        };
        //Expected tokens: id = expr
        parse.parseAssignmentStatement = function () {
        };
        //Expected tokens: type id
        parse.parseVarDecl = function () {
        };
        //Expected tokens: while boolexpr block
        parse.parseWhileStatement = function () {
        };
        //Expected tokens: if boolexpr block
        parse.parseIfStatement = function () {
        };
        //Expected tokens: intexpr, stringexpr, boolexpr, id
        parse.parseExpr = function () {
        };
        //Expected tokens: digit intop expr
        //OR: digit
        parse.parseIntExpr = function () {
        };
        //Expected tokens: "charlist"
        parse.parseStringExpr = function () {
        };
        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        parse.parseBoolExpr = function () {
        };
        //Expected tokens: char
        parse.parseId = function () {
        };
        //Expected tokens: char charlist, space charlist, empty
        parse.parseCharList = function () {
            // else {
            //     //Not an empty else, represents do nothing.
            // }
        };
        //Expected tokens: int, string, boolean
        parse.parseType = function () {
            CSTTree.addNode("Type", "leaf");
            this.match(["int", "string", "boolean"]);
            CSTTree.climbTree();
        };
        //Expected tokens: a-z, A-Z
        parse.parseChar = function () {
            CSTTree.addNode("Char", "leaf");
            this.match(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
                "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]);
            CSTTree.climbTree();
        };
        //Expected tokens: space
        parse.parseSpace = function () {
            CSTTree.addNode("Space", "leaf");
            this.match([" "]);
            CSTTree.climbTree();
        };
        //Expected tokens: 0-9
        parse.parseDigit = function () {
            CSTTree.addNode("Digit", "leaf");
            this.match(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
            CSTTree.climbTree();
        };
        //Expected tokens: ==, !=
        parse.parseBoolOp = function () {
            CSTTree.addNode("BoolOp", "leaf");
            this.match(["==", "!="]);
            CSTTree.climbTree();
        };
        //Expected tokens: false, true
        parse.parseBoolVal = function () {
            CSTTree.addNode("BoolVal", "leaf");
            this.match(["false", "true"]);
            CSTTree.climbTree();
        };
        //Expected tokens: +
        parse.parseIntOp = function () {
            CSTTree.addNode("IntOp", "leaf");
            this.match(["+"]);
            CSTTree.climbTree();
        };
        return parse;
    }());
    mackintosh.parse = parse;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=parse.js.map