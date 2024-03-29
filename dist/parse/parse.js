var mackintosh;
(function (mackintosh) {
    //Class that represents parse
    class parse {
        //Recursive descent parser implimentation.
        static parse(parseTokens) {
            let isParsed = false;
            CSTTree = new mackintosh.CST();
            ASTTree = new mackintosh.CST();
            tokenPointer = 0;
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("PARSER - Parsing Program " + (programCount - 1));
            //Check if there are tokens in the token stream.
            if (parseTokens.length == 0) {
                _Functions.log("PARSER ERROR - There are no tokens to be parsed.");
                parseErrCount++;
            }
            //Begin parse.
            else {
                //Use try catch to check for parse failures and output them.
                try {
                    this.parseProgram(parseTokens);
                    _Functions.log("PARSER - Parse completed with " + parseErrCount + " errors and " +
                        parseWarnCount + " warnings");
                    //Prints the CST if there are no more errors.
                    if (parseErrCount <= 0) {
                        isParsed = true;
                        _Functions.log("\n");
                        _Functions.log("\n");
                        _Functions.log("PARSER - Program " + (programCount - 1) + " CST:");
                        _Functions.log(CSTTree.toString());
                        _Functions.log("\n");
                        _Functions.log("\n");
                        _Functions.log("PARSER - Program " + (programCount - 1) + " AST:");
                        _Functions.log(ASTTree.toString());
                    }
                    else {
                        isParsed = false;
                        _Functions.log("\n");
                        _Functions.log("\n");
                        _Functions.log("PARSER - CST and AST not displayed due to parse errors.");
                    }
                }
                catch (error) {
                    _Functions.log(error);
                    _Functions.log("PARSER - Error caused parse to end.");
                    parseErrCount++;
                }
            }
            return isParsed;
        }
        //Match function.
        static match(expectedTokens, parseToken, isString) {
            //Check if the token is in a the expected token array.
            if (isString) {
                if (characters.test(parseToken)) {
                    isMatch = true;
                }
            }
            else {
                for (let i = 0; i < expectedTokens.length; i++) {
                    if (expectedTokens[i] == parseToken) {
                        isMatch = true;
                    }
                }
            }
            if (isMatch) {
                _Functions.log("PARSER - Token Matched! " + parseToken);
                CSTTree.addNode(parseToken, "leaf");
                //Don't increment the token pointer if its a string, its already where it needs to be.
                if (!isString) {
                    tokenPointer++;
                }
                isMatch = false;
                //Add AST Node.
                if (isASTNode) {
                    ASTTree.addNode(parseToken, "leaf");
                }
                isASTNode = false;
            }
            else {
                _Functions.log("PARSER ERROR - Expected tokens (" + expectedTokens.toString() + ") but got "
                    + parseToken + " instead.");
                parseErrCount++;
            }
        }
        //Methods for recursive descent parser - Start symbol: program.
        //Expected tokens - block, $
        static parseProgram(parseTokens) {
            _Functions.log("PARSER - parseProgram()");
            //Add the program node to the tree. This should be the root node.
            CSTTree.addNode("Program", "branch");
            //Begin parse block.
            this.parseBlock(parseTokens);
            //Check for EOP at the end of program.
            if (parseTokens[tokenPointer] == "$") {
                this.match(["$"], parseTokens[tokenPointer], false);
                _Functions.log("PARSER - Program successfully parsed.");
            }
            else if (parseTokens[tokenPointer + 1] == undefined) {
                _Functions.log("PARSER ERROR - EOP $ not found at end of program.");
                parseErrCount++;
            }
        }
        //Expected tokens: { statementList }
        static parseBlock(parseTokens) {
            _Functions.log("PARSER - parseBlock()");
            CSTTree.addNode("Block", "branch");
            ASTTree.addNode("Block", "branch");
            this.parseOpenBrace(parseTokens);
            this.parseStatementList(parseTokens);
            this.parseCloseBrace(parseTokens);
            CSTTree.climbTree();
            if (ASTTree.getRoot() != ASTTree.getCurNode()) {
                ASTTree.climbTree();
            }
        }
        //Expected tokens: statement statementList
        //OR - empty
        static parseStatementList(parseTokens) {
            //Check if the token is empty or not.
            _Functions.log("PARSER - parseStatementList()");
            CSTTree.addNode("StatementList", "branch");
            while (parseTokens[tokenPointer] != "}") {
                _Functions.log("PARSER - parseStatement()");
                CSTTree.addNode("Statement", "branch");
                //this.parseStatement(parseTokens);
                //Use regular expressions from lex to check what type of statement is to be parsed.
                if (printRegEx.test(parseTokens[tokenPointer])) {
                    this.parsePrintStatement(parseTokens);
                }
                //Check for assignment op.
                else if (assignment.test(parseTokens[tokenPointer + 1])) {
                    this.parseAssignmentStatement(parseTokens);
                }
                //Check for var declaration types - boolean, int, string.
                else if (boolRegEx.test(parseTokens[tokenPointer]) || stringRegEx.test(parseTokens[tokenPointer])
                    || intRegEx.test(parseTokens[tokenPointer])) {
                    this.parseVarDecl(parseTokens);
                }
                //Check for while statement.
                else if (whileRegEx.test(parseTokens[tokenPointer])) {
                    this.parseWhileStatement(parseTokens);
                }
                //Check for if statement.
                else if (ifRegEx.test(parseTokens[tokenPointer])) {
                    this.parseIfStatement(parseTokens);
                }
                //Check for opening or closing block.
                else if (leftBlock.test(parseTokens[tokenPointer])) {
                    this.parseBlock(parseTokens);
                }
                else {
                    _Functions.log("PARSER ERROR - Expected beginning of statement tokens"
                        + "(if, print, while, {}, assignment statement, boolean, int, string)");
                    parseErrCount++;
                    break;
                }
                CSTTree.climbTree();
            }
            CSTTree.climbTree();
        }
        //Expected tokens: print( expr )
        static parsePrintStatement(parseTokens) {
            _Functions.log("PARSER - parsePrintStatement()");
            CSTTree.addNode("PrintStatement", "branch");
            ASTTree.addNode("PrintStatement", "branch");
            this.parsePrint(parseTokens);
            this.parseParen(parseTokens);
            this.parseExpr(parseTokens);
            this.parseParen(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        }
        //Expected tokens: id = exprx
        static parseAssignmentStatement(parseTokens) {
            _Functions.log("PARSER - parseAssignmentStatement()");
            CSTTree.addNode("AssignmentStatement", "branch");
            ASTTree.addNode("AssignmentStatement", "branch");
            this.parseId(parseTokens);
            this.parseAssignmentOp(parseTokens);
            this.parseExpr(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        }
        //Expected tokens: type id
        static parseVarDecl(parseTokens) {
            _Functions.log("PARSER - parseVarDecl()");
            CSTTree.addNode("VarDecl", "branch");
            ASTTree.addNode("VarDecl", "branch");
            this.parseType(parseTokens);
            this.parseId(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        }
        //Expected tokens: while boolexpr block
        static parseWhileStatement(parseTokens) {
            _Functions.log("PARSER - parseWhileStatement()");
            CSTTree.addNode("WhileStatement", "branch");
            ASTTree.addNode("WhileStatement", "branch");
            this.parseWhile(parseTokens);
            this.parseBoolExpr(parseTokens);
            this.parseBlock(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        }
        //Expected tokens: if boolexpr block
        static parseIfStatement(parseTokens) {
            _Functions.log("PARSER - parseIfStatement()");
            CSTTree.addNode("IfStatement", "branch");
            ASTTree.addNode("IfStatement", "branch");
            this.parseIf(parseTokens);
            this.parseBoolExpr(parseTokens);
            this.parseBlock(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        }
        //Expected tokens: intexpr, stringexpr, boolexpr, id
        static parseExpr(parseTokens) {
            _Functions.log("PARSER - parseExpr()");
            CSTTree.addNode("Expr", "branch");
            //Check what type of expr this token is.
            if (digits.test(parseTokens[tokenPointer])) {
                this.parseIntExpr(parseTokens);
                //Handle multiple digits.
                while (digits.test(parseTokens[tokenPointer])) {
                    this.parseIntExpr(parseTokens);
                }
            }
            //String check.
            else if (quotes.test(parseTokens[tokenPointer])) {
                this.parseStringExpr(parseTokens);
            }
            //This handles if its an id.
            else if (characters.test(parseTokens[tokenPointer])) {
                if (parseTokens[tokenPointer].length > 1) {
                    if (trueRegEx.test(parseTokens[tokenPointer]) || falseRegEx.test(parseTokens[tokenPointer])) {
                        this.parseBoolExpr(parseTokens);
                    }
                }
                else {
                    this.parseId(parseTokens);
                }
            }
            //Bool expr.
            CSTTree.climbTree();
        }
        //Expected tokens: digit intop expr
        //OR: digit
        static parseIntExpr(parseTokens) {
            _Functions.log("PARSER - parseIntExpr()");
            CSTTree.addNode("IntExpr", "branch");
            //ASTTree.addNode("IntExpr", "branch");
            //Check if this is to be an expression or a single digit.
            if (parseTokens[tokenPointer + 1] == "+") {
                this.parseDigit(parseTokens);
                this.parseIntOp(parseTokens);
                this.parseExpr(parseTokens);
            }
            else {
                this.parseDigit(parseTokens);
            }
            CSTTree.climbTree();
            //ASTTree.climbTree();
        }
        //Expected tokens: "charlist"
        static parseStringExpr(parseTokens) {
            _Functions.log("PARSER - parseStringExpr()");
            CSTTree.addNode("StringExpr", "branch");
            //ASTTree.addNode("StringExpr", "branch");
            this.parseQuotes(parseTokens);
            this.parseCharList(parseTokens);
            this.parseQuotes(parseTokens);
            CSTTree.climbTree();
            //ASTTree.climbTree();
        }
        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        static parseBoolExpr(parseTokens) {
            _Functions.log("PARSER - parseBoolExpr()");
            CSTTree.addNode("BooleanExpr", "branch");
            //ASTTree.addNode("BooleanExpr", "branch");
            //If match parenthesis = true: (expr boolop expr)
            if (parseTokens[tokenPointer] == "(" || parseTokens[tokenPointer] == ")") {
                this.parseParen(parseTokens);
                //Add AST node depending on if it is checking isEqual or isNotEqual.
                if (parseTokens[tokenPointer + 1] == "==") {
                    ASTTree.addNode("isEqual", "branch");
                }
                else if (parseTokens[tokenPointer + 1] == "!=") {
                    ASTTree.addNode("isNotEqual", "branch");
                }
                this.parseExpr(parseTokens);
                this.parseBoolOp(parseTokens);
                this.parseExpr(parseTokens);
                this.parseParen(parseTokens);
            }
            //Boolean value.
            else {
                ASTTree.addNode("BooleanExpr", "branch");
                this.parseBoolVal(parseTokens);
            }
            CSTTree.climbTree();
            ASTTree.climbTree();
        }
        //Expected tokens: char
        static parseId(parseTokens) {
            _Functions.log("PARSER - parseId()");
            CSTTree.addNode("Id", "branch");
            this.parseChar(parseTokens);
            CSTTree.climbTree();
        }
        //Expected tokens: char charlist, space charlist, empty
        static parseCharList(parseTokens) {
            _Functions.log("PARSER - parseCharList()");
            CSTTree.addNode("CharList", "branch");
            if (parseTokens[tokenPointer] === " ") {
                this.parseSpace(parseTokens);
            }
            else if (characters.test(parseTokens[tokenPointer])) {
                let string = "";
                //Builds string until there is a quote.
                while (!quotes.test(parseTokens[tokenPointer])) {
                    //this.parseChar(parseTokens);
                    string += parseTokens[tokenPointer];
                    tokenPointer++;
                }
                _Functions.log("PARSER - String: " + string);
                this.parseString(parseTokens, string);
            }
            else {
                //Not an empty else, represents do nothing.
            }
            CSTTree.climbTree();
        }
        //Expected tokens: int, string, boolean
        static parseType(parseTokens) {
            isASTNode = true;
            this.match(["int", "string", "boolean"], parseTokens[tokenPointer], false);
        }
        //Expected tokens: a-z
        static parseChar(parseTokens) {
            isASTNode = true;
            this.match(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
                "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
                "y", "z"], parseTokens[tokenPointer], false);
        }
        static parseString(parseTokens, string) {
            isASTNode = true;
            this.match(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
                "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
                "y", "z"], string, true);
        }
        //Expected tokens: space
        static parseSpace(parseTokens) {
            this.match([" "], parseTokens[tokenPointer], false);
        }
        //Expected tokens: 0-9
        static parseDigit(parseTokens) {
            isASTNode = true;
            this.match(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], parseTokens[tokenPointer], false);
        }
        //Expected tokens: ==, !=
        static parseBoolOp(parseTokens) {
            this.match(["==", "!="], parseTokens[tokenPointer], false);
        }
        //Expected tokens: false, true
        static parseBoolVal(parseTokens) {
            isASTNode = true;
            this.match(["false", "true"], parseTokens[tokenPointer], false);
        }
        //Expected tokens: +
        static parseIntOp(parseTokens) {
            this.match(["+"], parseTokens[tokenPointer], false);
        }
        static parseParen(parseTokens) {
            this.match(["(", ")"], parseTokens[tokenPointer], false);
        }
        static parseAssignmentOp(parseTokens) {
            this.match(["="], parseTokens[tokenPointer], false);
        }
        static parseQuotes(parseTokens) {
            this.match(['"', '"'], parseTokens[tokenPointer], false);
        }
        static parseIf(parseTokens) {
            this.match(["if"], parseTokens[tokenPointer], false);
        }
        static parseWhile(parseTokens) {
            this.match(["while"], parseTokens[tokenPointer], false);
        }
        static parsePrint(parseTokens) {
            this.match(["print"], parseTokens[tokenPointer], false);
        }
        static parseOpenBrace(parseTokens) {
            this.match(["{"], parseTokens[tokenPointer], false);
        }
        static parseCloseBrace(parseTokens) {
            this.match(["}"], parseTokens[tokenPointer], false);
        }
    }
    mackintosh.parse = parse;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=parse.js.map