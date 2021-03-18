var mackintosh;
(function (mackintosh) {
    //Class that represents parse/
    var parse = /** @class */ (function () {
        //Get token stream from completed lex.
        function parse(tokenStream) {
            this.parseTokens = tokenStream;
        }
        //Recursive descent parser implimentation.
        parse.prototype.parse = function () {
            //i represents the token pointer.
            for (var i = 0; i < this.parseTokens.length; i++) {
                var tokenName = this.parseTokens[i].getTokenValue();
                this.curToken = tokenName;
            }
        };
        //Match function.
        parse.prototype.match = function (token) {
            return this.isMatch;
        };
        //Methods for recursive descent parser - Start symbol: program.
        parse.prototype.parseProgram = function () {
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