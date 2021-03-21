var mackintosh;
(function (mackintosh) {
    //Class that represents parse/
    var parse = /** @class */ (function () {
        //Get token stream from completed lex.
        function parse(tokenStream) {
            this.parseTokens = tokenStream;
            this.CST = new mackintosh.CST();
        }
        //Recursive descent parser implimentation.
        parse.prototype.parse = function () {
            _Functions.log("PARSER - Parsing Program " + programCount);
            //Check if there are tokens in the token stream.
            if (this.parseTokens.length <= 0) {
                _Functions.log("PARSER ERROR - There are no tokens to be parsed.");
            }
            //Begin parse.
            else {
                //Use try catch to check for parse failures and output them.
                try {
                    this.parseProgram();
                    _Functions.log("PARSER - Parse completed.");
                    return this.CST.getRoot();
                }
                catch (error) {
                    _Functions.log("PARSER - Error caused parse to end.");
                }
            }
        };
        //Match function.
        parse.prototype.match = function (token) {
            //Check if the token is in a the expected token array.
            for (var i = 0; i < this.expectedTokens.length; i++) {
                if (this.expectedTokens[i].getTokenValue() == token) {
                    this.isMatch == true;
                }
            }
            if (this.isMatch) {
                _Functions.log("PARSER - Token Matched!" + token);
            }
            else {
                _Functions.log("PARSER ERROR - Expected tokens (" + this.expectedTokens.toString() + ") but got "
                    + token + " instead.");
            }
        };
        //Methods for recursive descent parser - Start symbol: program.
        //Expected tokens - block, $
        parse.prototype.parseProgram = function () {
            //Add the program node to the tree. This should be the root node.
            this.CST.addNode("Program", "branch");
            //Begin parse block.
            this.parseBlock();
            //Check for EOP at the end of program.
            if (this.parseTokens[this.tokenPointer].getTokenValue() == "$") {
                _Functions.log("PARSER - Program successfully parsed.");
            }
        };
        //Expected tokens: { statementList }
        parse.prototype.parseBlock = function () {
        };
        //Expected tokens: statement statementList
        //OR - empty
        parse.prototype.parseStatementList = function () {
            // else {
            //     //Not an empty else, represents do nothing.
            // }
        };
        //Expected tokens: print, assignment, var declaration, while, if, block
        parse.prototype.parseStatement = function () {
        };
        //Expected tokens: print( expr )
        parse.prototype.parsePrintStatement = function () {
        };
        //Expected tokens: id = expr
        parse.prototype.parseAssignmentStatement = function () {
        };
        //Expected tokens: type id
        parse.prototype.parseVarDecl = function () {
        };
        //Expected tokens: while boolexpr block
        parse.prototype.parseWhileStatement = function () {
        };
        //Expected tokens: if boolexpr block
        parse.prototype.parseIfStatement = function () {
        };
        //Expected tokens: intexpr, stringexpr, boolexpr, id
        parse.prototype.parseExpr = function () {
        };
        //Expected tokens: digit intop expr
        //OR: digit
        parse.prototype.parseIntExpr = function () {
        };
        //Expected tokens: "charlist"
        parse.prototype.parseStringExpr = function () {
        };
        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        parse.prototype.parseBoolExpr = function () {
        };
        //Expected tokens: char
        parse.prototype.parseId = function () {
        };
        //Expected tokens: char charlist, space charlist, empty
        parse.prototype.parseCharList = function () {
            // else {
            //     //Not an empty else, represents do nothing.
            // }
        };
        //Expected tokens: int, string, boolean
        parse.prototype.parseType = function () {
        };
        //Expected tokens: a-z, A-Z
        parse.prototype.parseChar = function () {
        };
        //Expected tokens: space
        parse.prototype.parseSpace = function () {
        };
        //Expected tokens: 0-9
        parse.prototype.parseDigit = function () {
        };
        //Expected tokens: ==, !=
        parse.prototype.parseBoolOp = function () {
        };
        //Expected tokens: false, true
        parse.prototype.parseBoolVal = function () {
        };
        //Expected tokens: +
        parse.prototype.parseIntOp = function () {
        };
        return parse;
    }());
    mackintosh.parse = parse;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=parse.js.map