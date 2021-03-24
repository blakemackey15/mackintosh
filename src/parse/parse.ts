module mackintosh {


    //Class that represents parse/
    export class parse {

        //Recursive descent parser implimentation.
        public static parse(parseTokens : Array<string>) {
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
                if(expectedTokens[i] === parseToken) {
                    isMatch == true;
                }

            }

            if(isMatch) {
                _Functions.log("PARSER - Token Matched!" + token);
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

            else {
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
            CSTTree.climbTree();
        }

        //Expected tokens: id = expr
        public static parseAssignmentStatement(parseTokens : Array<string>) {
            CSTTree.addNode("AssignmentStatement", "branch");
            CSTTree.climbTree();
        }

        //Expected tokens: type id
        public static parseVarDecl(parseTokens : Array<string>) {
            CSTTree.addNode("VarDecl", "branch");
            CSTTree.climbTree();
        }

        //Expected tokens: while boolexpr block
        public static parseWhileStatement(parseTokens : Array<string>) {
            CSTTree.addNode("WhileStatement", "branch");
            CSTTree.climbTree();

        }

        //Expected tokens: if boolexpr block
        public static parseIfStatement(parseTokens : Array<string>) {
            CSTTree.addNode("IfStatement", "branch");
            CSTTree.climbTree();
        }

        //Expected tokens: intexpr, stringexpr, boolexpr, id
        public static parseExpr(parseTokens : Array<string>) {
            
        }

        //Expected tokens: digit intop expr
        //OR: digit
        public static parseIntExpr(parseTokens : Array<string>) {

        }

        //Expected tokens: "charlist"
        public static parseStringExpr(parseTokens : Array<string>) {

        }

        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        public static parseBoolExpr(parseTokens : Array<string>) {

        }

        //Expected tokens: char
        public static parseId(parseTokens : Array<string>) {

        }

        //Expected tokens: char charlist, space charlist, empty
        public static parseCharList(parseTokens : Array<string>) {
            // else {
            //     //Not an empty else, represents do nothing.
            // }
        }

        //Expected tokens: int, string, boolean
        public static parseType(parseTokens : Array<string>) {
            CSTTree.addNode("Type", "branch");
            this.match(["int", "string", "boolean"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        //Expected tokens: a-z, A-Z
        public static parseChar(parseTokens : Array<string>) {
            CSTTree.addNode("Char", "branch");
            this.match(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
            "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", 
            "y", "z"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        //Expected tokens: space
        public static parseSpace(parseTokens : Array<string>) {
            CSTTree.addNode("Space", "branch");
            this.match([" "], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        //Expected tokens: 0-9
        public static parseDigit(parseTokens : Array<string>) {
            CSTTree.addNode("Digit", "branch");
            this.match(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        //Expected tokens: ==, !=
        public static parseBoolOp(parseTokens : Array<string>) {
            CSTTree.addNode("BoolOp", "branch");
            this.match(["==", "!="], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        //Expected tokens: false, true
        public static parseBoolVal(parseTokens : Array<string>) {
            CSTTree.addNode("BoolVal", "branch");
            this.match(["false", "true"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

        //Expected tokens: +
        public static parseIntOp(parseTokens : Array<string>) {
            CSTTree.addNode("IntOp", "branch");
            this.match(["+"], parseTokens[tokenPointer]);
            CSTTree.climbTree();
        }

    }
}