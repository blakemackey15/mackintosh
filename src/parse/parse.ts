module mackintosh {


    //Class that represents parse/
    export class parse {

        //Global Variables.
        private curToken : string;

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
        public static match(token : string) {
            //Check if the token is in a the expected token array.
            for(let i = 0; i < expectedTokens.length; i++) {
                if(expectedTokens[i].getTokenValue() == token) {
                    isMatch == true;
                }

            }

            if(isMatch) {
                _Functions.log("PARSER - Token Matched!" + token);
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
            this.parseBlock(parseTokens);

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
        public static parseBlock(parseTokens : Array<token>) {
            CSTTree.addNode("Block", "branch");
            this.parseStatementList(parseTokens);
            
        }

        //Expected tokens: statement statementList
        //OR - empty
        public static parseStatementList(parseTokens : Array<token>) {
            // else {
            //     //Not an empty else, represents do nothing.
            // }
        }

        //Expected tokens: print, assignment, var declaration, while, if, block
        public static parseStatement(parseTokens : Array<token>) {

        }

        //Expected tokens: print( expr )
        public static parsePrintStatement(parseTokens : Array<token>) {

        }

        //Expected tokens: id = expr
        public static parseAssignmentStatement(parseTokens : Array<token>) {

        }

        //Expected tokens: type id
        public static parseVarDecl(parseTokens : Array<token>) {

        }

        //Expected tokens: while boolexpr block
        public static parseWhileStatement(parseTokens : Array<token>) {

        }

        //Expected tokens: if boolexpr block
        public static parseIfStatement(parseTokens : Array<token>) {

        }

        //Expected tokens: intexpr, stringexpr, boolexpr, id
        public static parseExpr(parseTokens : Array<token>) {

        }

        //Expected tokens: digit intop expr
        //OR: digit
        public static parseIntExpr(parseTokens : Array<token>) {

        }

        //Expected tokens: "charlist"
        public static parseStringExpr(parseTokens : Array<token>) {

        }

        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        public static parseBoolExpr(parseTokens : Array<token>) {

        }

        //Expected tokens: char
        public static parseId(parseTokens : Array<token>) {

        }

        //Expected tokens: char charlist, space charlist, empty
        public static parseCharList(parseTokens : Array<token>) {
            // else {
            //     //Not an empty else, represents do nothing.
            // }
        }

        //Expected tokens: int, string, boolean
        public static parseType(parseTokens : Array<token>) {

        }

        //Expected tokens: a-z, A-Z
        public static parseChar(parseTokens : Array<token>) {

        }

        //Expected tokens: space
        public static parseSpace(parseTokens : Array<token>) {

        }

        //Expected tokens: 0-9
        public static parseDigit(parseTokens : Array<token>) {

        }

        //Expected tokens: ==, !=
        public parseBoolOp(parseTokens : Array<token>) {

        }

        //Expected tokens: false, true
        public static parseBoolVal(parseTokens : Array<token>) {

        }

        //Expected tokens: +
        public static parseIntOp(parseTokens : Array<token>) {

        }

    }
}