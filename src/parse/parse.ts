module mackintosh {


    //Class that represents parse/
    export class parse {

        //Recursive descent parser implimentation.
        public static parse(parseTokens : Array<string>) : boolean {
            debugger;
            let isParsed = false;
            CSTTree = new CST();
            ASTTree = new CST();
            tokenPointer = 0;
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("PARSER - Parsing Program " + (programCount - 1));

            //Check if there are tokens in the token stream.
            if(parseTokens.length == 0) {
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
                    if(parseErrCount <= 0) {
                        isParsed = true;
                        _Functions.log("\n");
                        _Functions.log("\n");
                        _Functions.log("PARSER - Program " + (programCount - 1) + " CST:");
                        _Functions.log(CSTTree.toString());
                        _Functions.log("\n");
                        _Functions.log("\n");
                        _Functions.log("PARSER - Program " + (programCount - 1) + " AST:")
                        _Functions.log(ASTTree.toString());
                    }

                    else {
                        isParsed = false;
                        _Functions.log("\n");
                        _Functions.log("\n");
                        _Functions.log("PARSER - CST and AST not displayed due to parse errors.");
                        
                    }
                }

                catch (error){
                    _Functions.log(error);
                    _Functions.log("PARSER - Error caused parse to end.");
                    parseErrCount++;
                }

            }

            return isParsed;
        }

        //Match function.
        public static match(expectedTokens : Array<string>, parseToken : string) {
            //Check if the token is in a the expected token array.
            for(let i = 0; i < expectedTokens.length; i++) {
                if(expectedTokens[i] == parseToken) {
                    isMatch = true;
                }

            }

            if(isMatch) {
                _Functions.log("PARSER - Token Matched! " + parseToken);
                CSTTree.addNode(parseToken, "leaf");
                tokenPointer++;
                isMatch = false;

                //Add AST Node.
                if(isASTNode) {
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
        public static parseProgram(parseTokens : Array<string>) {
            _Functions.log("PARSER - parseProgram()");
            //Add the program node to the tree. This should be the root node.
            CSTTree.addNode("Program", "branch");

            //Begin parse block.
            this.parseBlock(parseTokens);

            //Check for EOP at the end of program.
            if(parseTokens[tokenPointer] == "$") {
                this.match(["$"], parseTokens[tokenPointer]);
                _Functions.log("PARSER - Program successfully parsed.");
            }

            else if (parseTokens[tokenPointer + 1] == undefined){
                _Functions.log("PARSER ERROR - EOP $ not found at end of program.");
                parseErrCount++;
            }
        }

        //Expected tokens: { statementList }
        public static parseBlock(parseTokens : Array<string>) {
            _Functions.log("PARSER - parseBlock()");
            CSTTree.addNode("Block", "branch");
            ASTTree.addNode("Block", "branch");
            this.parseOpenBrace(parseTokens);
            this.parseStatementList(parseTokens);
            this.parseCloseBrace(parseTokens);
            CSTTree.climbTree();
        }

        //Expected tokens: statement statementList
        //OR - empty
        public static parseStatementList(parseTokens : Array<string>) {
            //Check if the token is empty or not.
            _Functions.log("PARSER - parseStatementList()");
            CSTTree.addNode("StatementList", "branch");
            while(parseTokens[tokenPointer] != "}") {
                _Functions.log("PARSER - parseStatement()");
                CSTTree.addNode("Statement", "branch");
                //this.parseStatement(parseTokens);
                //Use regular expressions from lex to check what type of statement is to be parsed.
                if(printRegEx.test(parseTokens[tokenPointer])){
                    this.parsePrintStatement(parseTokens);
                }

                //Check for assignment op.
                else if(assignment.test(parseTokens[tokenPointer + 1])) {
                    this.parseAssignmentStatement(parseTokens);
                }

                //Check for var declaration types - boolean, int, string.
                else if(boolRegEx.test(parseTokens[tokenPointer]) || stringRegEx.test(parseTokens[tokenPointer]) 
                || intRegEx.test(parseTokens[tokenPointer])) {
                    this.parseVarDecl(parseTokens);
                }

                //Check for while statement.
                else if(whileRegEx.test(parseTokens[tokenPointer])) {
                    this.parseWhileStatement(parseTokens);
                }

                //Check for if statement.
                else if(ifRegEx.test(parseTokens[tokenPointer])) {
                    this.parseIfStatement(parseTokens);
                }

                //Check for opening or closing block.
                else if(leftBlock.test(parseTokens[tokenPointer])) {
                    this.parseBlock(parseTokens);
                }

                else {
                    _Functions.log("PARSER ERROR - Expected beginning of statement tokens (if, print, while, {}, assignment statement, boolean, int, string)");
                    parseErrCount++;
                    break;
                }

                CSTTree.climbTree();
            }

            CSTTree.climbTree();
        }

        //Expected tokens: print( expr )
        public static parsePrintStatement(parseTokens : Array<string>) {
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
        public static parseAssignmentStatement(parseTokens : Array<string>) {
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
        public static parseVarDecl(parseTokens : Array<string>) {
            _Functions.log("PARSER - parseVarDecl()");
            CSTTree.addNode("VarDecl", "branch");
            ASTTree.addNode("VarDecl", "branch");
            this.parseType(parseTokens);
            this.parseId(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        }

        //Expected tokens: while boolexpr block
        public static parseWhileStatement(parseTokens : Array<string>) {
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
        public static parseIfStatement(parseTokens : Array<string>) {
            _Functions.log("PARSER - parseIfStatement()");
            CSTTree.addNode("IfStatement", "branch");
            this.parseIf(parseTokens);
            this.parseBoolExpr(parseTokens);
            this.parseBlock(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        }

        //Expected tokens: intexpr, stringexpr, boolexpr, id
        public static parseExpr(parseTokens : Array<string>) {
            _Functions.log("PARSER - parseExpr()");
            CSTTree.addNode("Expr", "branch");

            //Check what type of expr this token is.
            if(digits.test(parseTokens[tokenPointer])) {
                this.parseIntExpr(parseTokens);
                //Handle multiple digits.
                while(digits.test(parseTokens[tokenPointer])) {
                    this.parseIntExpr(parseTokens);
                }
            }

            //String check.
            if(quotes.test(parseTokens[tokenPointer])) {
                this.parseStringExpr(parseTokens);
            }

            //This handles if its an id.
            if(characters.test(parseTokens[tokenPointer])) {
                if(parseTokens[tokenPointer].length > 1) {
                    if(trueRegEx.test(parseTokens[tokenPointer]) || falseRegEx.test(parseTokens[tokenPointer])) {
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
        public static parseIntExpr(parseTokens : Array<string>) {
            _Functions.log("PARSER - parseIntExpr()");
            CSTTree.addNode("IntExpr", "branch");

            //Check if this is to be an expression or a single digit.
            if(parseTokens[tokenPointer + 1] == "+") {
                this.parseDigit(parseTokens);
                this.parseIntOp(parseTokens);
                this.parseExpr(parseTokens);
            }

            else {
                this.parseDigit(parseTokens);
            }

            CSTTree.climbTree();
        }

        //Expected tokens: "charlist"
        public static parseStringExpr(parseTokens : Array<string>) {
            _Functions.log("PARSER - parseStringExpr()");
            CSTTree.addNode("StringExpr", "branch");
            this.parseQuotes(parseTokens);
            this.parseCharList(parseTokens);
            this.parseQuotes(parseTokens);
            CSTTree.climbTree();
        }

        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        public static parseBoolExpr(parseTokens : Array<string>) {
            _Functions.log("PARSER - parseBoolExpr()");
            CSTTree.addNode("BooleanExpr", "branch");
            //If match parenthesis = true: (expr boolop expr)
            if(parseTokens[tokenPointer] == "(" || parseTokens[tokenPointer] == ")") {
                this.parseParen(parseTokens);

                //Add AST node depending on if it is checking isEqual or isNotEqual.
                if(parseTokens[tokenPointer + 1] == "==") {
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
                this.parseBoolVal(parseTokens);
            }
            CSTTree.climbTree();
            ASTTree.climbTree();
        }

        //Expected tokens: char
        public static parseId(parseTokens : Array<string>) {
            _Functions.log("PARSER - parseId()");
            CSTTree.addNode("Id", "branch");
            this.parseChar(parseTokens);
            CSTTree.climbTree();
        }

        //Expected tokens: char charlist, space charlist, empty
        public static parseCharList(parseTokens : Array<string>) {
            _Functions.log("PARSER - parseCharList()");
            CSTTree.addNode("CharList", "branch");

            if(parseTokens[tokenPointer] === " ") {
                this.parseSpace(parseTokens);
            }

            else if(characters.test(parseTokens[tokenPointer])) {
                let string : string;

                //Builds string until there is a quote.
                while(!quotes.test(parseTokens[tokenPointer])){
                    this.parseChar(parseTokens);
                    string += parseTokens[tokenPointer];
                }

                _Functions.log("PARSER - String: " + string);
            }

            else {
                 //Not an empty else, represents do nothing.
            }
            CSTTree.climbTree();

        }

        //Expected tokens: int, string, boolean
        public static parseType(parseTokens : Array<string>) {
            isASTNode = true;
            this.match(["int", "string", "boolean"], parseTokens[tokenPointer]);
        }

        //Expected tokens: a-z
        public static parseChar(parseTokens : Array<string>) {
            isASTNode = true;
            this.match(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
            "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", 
            "y", "z"], parseTokens[tokenPointer]);
        }

        //Expected tokens: space
        public static parseSpace(parseTokens : Array<string>) {
            this.match([" "], parseTokens[tokenPointer]);
        }

        //Expected tokens: 0-9
        public static parseDigit(parseTokens : Array<string>) {
            isASTNode = true;
            this.match(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], parseTokens[tokenPointer]);
        }

        //Expected tokens: ==, !=
        public static parseBoolOp(parseTokens : Array<string>) {
            this.match(["==", "!="], parseTokens[tokenPointer]);
        }

        //Expected tokens: false, true
        public static parseBoolVal(parseTokens : Array<string>) {
            isASTNode = true;
            this.match(["false", "true"], parseTokens[tokenPointer]);
        }

        //Expected tokens: +
        public static parseIntOp(parseTokens : Array<string>) {
            this.match(["+"], parseTokens[tokenPointer]);
        }

        public static parseParen(parseTokens : Array<string>) {
            this.match(["(", ")"], parseTokens[tokenPointer]);
        }

        public static parseAssignmentOp(parseTokens : Array<string>) {
            this.match(["="], parseTokens[tokenPointer]);
        }

        public static parseQuotes(parseTokens : Array<string>) {
            this.match(['"', '"'], parseTokens[tokenPointer]);
        }

        public static parseIf(parseTokens : Array<string>) {
            isASTNode = true;
            this.match(["if"], parseTokens[tokenPointer]);
        }

        public static parseWhile(parseTokens : Array<string>) {
            isASTNode = true;
            this.match(["while"], parseTokens[tokenPointer]);
        }

        public static parsePrint(parseTokens : Array<string>) {
            this.match(["print"], parseTokens[tokenPointer]);
        }

        public static parseOpenBrace(parseTokens : Array<string>) {
            this.match(["{"], parseTokens[tokenPointer]);
        }

        public static parseCloseBrace(parseTokens : Array<string>) {
            this.match(["}"], parseTokens[tokenPointer]);
        }

    }
}