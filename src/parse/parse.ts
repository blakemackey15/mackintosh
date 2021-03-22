module mackintosh {


    //Class that represents parse/
    export class parse {

        //Recursive descent parser implimentation.
        public static parse(parseTokens : Array<token>) {
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
                    return CSTTree.getRoot();
                }

                catch (error){
                    _Functions.log("PARSER - Error caused parse to end.");
                }

            }
        }

        //Match function.
        public static match(tokens : Array<string>) {
            //Check if the token is in a the expected token array.
            for(let i = 0; i < expectedTokens.length; i++) {
                if(expectedTokens[i].getTokenValue() == tokens[i]) {
                    isMatch == true;
                }

            }

            if(isMatch) {
                _Functions.log("PARSER - Token Matched!" + token);
                //TODO: Check if this is a leaf or branch node.
                CSTTree.addNode(curToken.getTokenValue(), "");
                CSTTree.climbTree();
            }

            else {
                _Functions.log("PARSER ERROR - Expected tokens (" + expectedTokens.toString() + ") but got " 
                + token + " instead.");
                parseErrCount++;
            }
        }

        //Methods for recursive descent parser - Start symbol: program.
        //Expected tokens - block, $
        public static parseProgram(parseTokens : Array<token>) {
            //Add the program node to the tree. This should be the root node.
            CSTTree.addNode("Program", "branch");

            //Begin parse block.
            this.parseBlock();

            //Check for EOP at the end of program.
            if(parseTokens[tokenPointer].getTokenValue() == "$") {
                _Functions.log("PARSER - Program successfully parsed.");

            }

            else {
                _Functions.log("PARSER ERROR - EOP $ not found at end of program.");
                parseErrCount++;
            }
        }

        //Expected tokens: { statementList }
        public static parseBlock() {
            CSTTree.addNode("Block", "branch");
            this.parseStatementList();
        }

        //Expected tokens: statement statementList
        //OR - empty
        public static parseStatementList() {
            // CSTTree.addNode("StatementList", "branch");
            // this.parseStatement(parseTokens);
            // this.parseStatementList(parseTokens);
            //if(){

            //}
            //else {
                 //Not an empty else, represents do nothing.
            //}
        }

        //Expected tokens: print, assignment, var declaration, while, if, block
        public static parseStatement() {

        }

        //Expected tokens: print( expr )
        public static parsePrintStatement() {

        }

        //Expected tokens: id = expr
        public static parseAssignmentStatement() {

        }

        //Expected tokens: type id
        public static parseVarDecl() {

        }

        //Expected tokens: while boolexpr block
        public static parseWhileStatement() {

        }

        //Expected tokens: if boolexpr block
        public static parseIfStatement() {

        }

        //Expected tokens: intexpr, stringexpr, boolexpr, id
        public static parseExpr() {

        }

        //Expected tokens: digit intop expr
        //OR: digit
        public static parseIntExpr() {

        }

        //Expected tokens: "charlist"
        public static parseStringExpr() {

        }

        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        public static parseBoolExpr() {

        }

        //Expected tokens: char
        public static parseId() {

        }

        //Expected tokens: char charlist, space charlist, empty
        public static parseCharList() {
            // else {
            //     //Not an empty else, represents do nothing.
            // }
        }

        //Expected tokens: int, string, boolean
        public static parseType() {
            CSTTree.addNode("Type", "leaf");
            this.match(["int", "string", "boolean"]);
            CSTTree.climbTree();
        }

        //Expected tokens: a-z, A-Z
        public static parseChar() {
            CSTTree.addNode("Char", "leaf");
            this.match(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
            "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]);
            CSTTree.climbTree();
        }

        //Expected tokens: space
        public static parseSpace() {
            CSTTree.addNode("Space", "leaf");
            this.match([" "]);
            CSTTree.climbTree();
        }

        //Expected tokens: 0-9
        public static parseDigit() {
            CSTTree.addNode("Digit", "leaf");
            this.match(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
            CSTTree.climbTree();
        }

        //Expected tokens: ==, !=
        public static parseBoolOp() {
            CSTTree.addNode("BoolOp", "leaf");
            this.match(["==", "!="]);
            CSTTree.climbTree();
        }

        //Expected tokens: false, true
        public static parseBoolVal() {
            CSTTree.addNode("BoolVal", "leaf");
            this.match(["false", "true"]);
            CSTTree.climbTree();
        }

        //Expected tokens: +
        public static parseIntOp() {
            CSTTree.addNode("IntOp", "leaf");
            this.match(["+"]);
            CSTTree.climbTree();
        }

    }
}