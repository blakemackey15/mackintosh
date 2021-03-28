module mackintosh {


    //Class that represents parse/
    export class parse {

        //Recursive descent parser implimentation.
        public static parse(parseTokens : Array<string>) {
            debugger;
            _Functions.log("PARSER - Parsing Program " + programCount);

            //Check if there are tokens in the token stream.
            if(parseTokens.length <= 0) {
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

                catch (error){
                    _Functions.log("PARSER - Error caused parse to end.");
                }

            }
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
                _Functions.log("PARSER - Token Matched!" + parseToken);
                CSTTree.addNode(parseToken, "leaf");
                tokenPointer++;
                CSTTree.climbTree();
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
            //Add the program node to the tree. This should be the root node.
            CSTTree.addNode("Program", "branch");

            //Begin parse block.
            this.parseBlock(parseTokens);

            //Check for EOP at the end of program.
            if(parseTokens[tokenPointer] == "$") {
                _Functions.log("PARSER - Program successfully parsed.");
            }

            else if (parseTokens[tokenPointer + 1] == undefined){
                _Functions.log("PARSER ERROR - EOP $ not found at end of program.");
                parseErrCount++;
            }
        }

        //Expected tokens: { statementList }
        public static parseBlock(parseTokens : Array<string>) {
            CSTTree.addNode("Block", "branch");
            this.parseStatementList(parseTokens);
            CSTTree.climbTree();
        }

        //Expected tokens: statement statementList
        //OR - empty
        public static parseStatementList(parseTokens : Array<string>) {
            //Check if the 
            if(parseTokens[tokenPointer].length != 0) {
                CSTTree.addNode("StatementList", "branch");
                this.parseStatement(parseTokens);
            }

            //Empty string - do nothing.
            else {
                 //Not an empty else, represents do nothing.
            }

            CSTTree.climbTree();
        }

        //Expected tokens: print, assignment, var declaration, while, if, block
        public static parseStatement(parseTokens : Array<string>) {
            CSTTree.addNode("Statement", "branch");

            //Use regular expressions from lex to check what type of statement is to be parsed.
            if(printRegEx.test(parseTokens[tokenPointer])){
                this.parsePrintStatement(parseTokens);
            }

            //Check for assignment op.
            if(assignment.test(parseTokens[tokenPointer])) {
                this.parseAssignmentStatement(parseTokens);
            }

            //Check for var declaration types - boolean, int, string.
            if(boolRegEx.test(parseTokens[tokenPointer]) || stringRegEx.test(parseTokens[tokenPointer]) 
              || intRegEx.test(parseTokens[tokenPointer])) {
                this.parseVarDecl(parseTokens);
            }

            //Check for while statement.
            if(whileRegEx.test(parseTokens[tokenPointer])) {
                this.parseWhileStatement(parseTokens);
            }

            //Check for if statement.
            if(ifRegEx.test(parseTokens[tokenPointer])) {
                this.parseIfStatement(parseTokens);
            }

            //Check for opening or closing block.
            if(leftBlock.test(parseTokens[tokenPointer]) || rightBlock.test(parseTokens[tokenPointer])) {
                this.parseBlock(parseTokens);
            }
            CSTTree.climbTree();

        }

        //Expected tokens: print( expr )
        public static parsePrintStatement(parseTokens : Array<string>) {
            CSTTree.addNode("PrintStatement", "branch");
            this.parsePrint(parseTokens);
            this.parseParen(parseTokens);
            this.parseExpr(parseTokens);
            this.parseParen(parseTokens);
            CSTTree.climbTree();
        }

        //Expected tokens: id = expr
        public static parseAssignmentStatement(parseTokens : Array<string>) {
            CSTTree.addNode("AssignmentStatement", "branch");
            this.parseId(parseTokens);
            this.parseAssignmentOp(parseTokens);
            this.parseExpr(parseTokens);
            CSTTree.climbTree();
        }

        //Expected tokens: type id
        public static parseVarDecl(parseTokens : Array<string>) {
            CSTTree.addNode("VarDecl", "branch");
            this.parseType(parseTokens);
            this.parseId(parseTokens);
            CSTTree.climbTree();
        }

        //Expected tokens: while boolexpr block
        public static parseWhileStatement(parseTokens : Array<string>) {
            CSTTree.addNode("WhileStatement", "branch");
            this.parseWhile(parseTokens);
            this.parseBoolExpr(parseTokens);
            this.parseBlock(parseTokens);
            CSTTree.climbTree();

        }

        //Expected tokens: if boolexpr block
        public static parseIfStatement(parseTokens : Array<string>) {
            CSTTree.addNode("IfStatement", "branch");
            this.parseIf(parseTokens);
            this.parseBoolExpr(parseTokens);
            this.parseBlock(parseTokens);
            CSTTree.climbTree();
        }

        //Expected tokens: intexpr, stringexpr, boolexpr, id
        public static parseExpr(parseTokens : Array<string>) {
            CSTTree.addNode("Expr", "branch");

            //Check what type of expr this token is.
            if(digits.test(parseTokens[tokenPointer])) {
                this.parseIntExpr(parseTokens);
            }

            //Check if there are more than 1 character - that means its a string and not an id. 
            if(characters.test(parseTokens[tokenPointer]) && parseTokens[tokenPointer].length != 0) {
                //Checks if the input value is true or false.
                if(trueRegEx.test(parseTokens[tokenPointer]) || falseRegEx.test(parseTokens[tokenPointer])) {
                    this.parseBoolExpr(parseTokens);
                }

                //If not, then its a string.
                else {
                    this.parseStringExpr(parseTokens);
                }
            }

            //This handles if its an id.
            if(characters.test(parseTokens[tokenPointer]) && parseTokens[tokenPointer].length == 0) {
                this.parseId(parseTokens);
            }

            CSTTree.climbTree();
        }

        //Expected tokens: digit intop expr
        //OR: digit
        public static parseIntExpr(parseTokens : Array<string>) {
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
            CSTTree.addNode("StringExpr", "branch");
            this.parseCharList(parseTokens);
            CSTTree.climbTree();

        }

        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        public static parseBoolExpr(parseTokens : Array<string>) {
            CSTTree.addNode("BooleanExpr", "branch");
            //If match parenthesis = true: (expr boolop expr)
            if(parseTokens[tokenPointer] == "(" || parseTokens[tokenPointer] == ")") {
                this.parseParen(parseTokens);
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
        }

        //Expected tokens: char
        public static parseId(parseTokens : Array<string>) {
            CSTTree.addNode("Id", "branch");
            this.parseChar(parseTokens);
            CSTTree.climbTree();
        }

        //Expected tokens: char charlist, space charlist, empty
        public static parseCharList(parseTokens : Array<string>) {
            CSTTree.addNode("CharList", "branch");

            if(parseTokens[tokenPointer] === " ") {
                this.parseSpace(parseTokens);
                this.parseCharList(parseTokens);
            }

            else if(characters.test(parseTokens[tokenPointer])) {
                this.parseChar(parseTokens);
                this.parseCharList(parseTokens);
            }

            else {
                 //Not an empty else, represents do nothing.
            }
            CSTTree.climbTree();

        }

        //Expected tokens: int, string, boolean
        public static parseType(parseTokens : Array<string>) {
            CSTTree.addNode("type", "branch");
            this.match(["int", "string", "boolean"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        //Expected tokens: a-z
        public static parseChar(parseTokens : Array<string>) {
            CSTTree.addNode("char", "branch");
            this.match(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
            "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", 
            "y", "z"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        //Expected tokens: space
        public static parseSpace(parseTokens : Array<string>) {
            CSTTree.addNode("space", "branch");
            this.match([" "], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        //Expected tokens: 0-9
        public static parseDigit(parseTokens : Array<string>) {
            CSTTree.addNode("digit", "branch");
            this.match(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        //Expected tokens: ==, !=
        public static parseBoolOp(parseTokens : Array<string>) {
            CSTTree.addNode("boolop", "branch");
            this.match(["==", "!="], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        //Expected tokens: false, true
        public static parseBoolVal(parseTokens : Array<string>) {
            CSTTree.addNode("boolval", "branch");
            this.match(["false", "true"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        //Expected tokens: +
        public static parseIntOp(parseTokens : Array<string>) {
            CSTTree.addNode("intop", "branch");
            this.match(["+"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        public static parseParen(parseTokens : Array<string>) {
            CSTTree.addNode("parenthesis", "branch");
            this.match(["(", ")"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        public static parseAssignmentOp(parseTokens : Array<string>) {
            CSTTree.addNode("assignmentOp", "branch");
            this.match(["="], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        public static parseQuotes(parseTokens : Array<string>) {
            CSTTree.addNode("quotes", "branch");
            this.match(['"', '"'], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        public static parseIf(parseTokens : Array<string>) {
            CSTTree.addNode("if", "branch");
            this.match(["if"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        public static parseWhile(parseTokens : Array<string>) {
            CSTTree.addNode("while", "branch");
            this.match(["while"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        public static parsePrint(parseTokens : Array<string>) {
            CSTTree.addNode("print", "branch");
            this.match(["print"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

    }
}