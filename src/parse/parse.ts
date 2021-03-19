module mackintosh {


    //Class that represents parse/
    export class parse {

        //Global Variables.
        private parseTokens : Array<token>;
        private CST : CST;
        private isMatch : boolean;
        private curToken : string;
        private tokenPointer : number;
        
        //Get token stream from completed lex.
        constructor(tokenStream : Array<token>) {
            this.parseTokens = tokenStream;
            this.CST = new CST();
        }

        //Recursive descent parser implimentation.
        public parse() {
            _Functions.log("PARSER - Parsing Program " + programCount);

            //Check if there are tokens in the token stream.
            if(this.parseTokens.length <= 0) {
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

                catch (error){
                    _Functions.log("PARSER - Error caused parse to end.");
                }

            }
        }

        //Match function.
        public match(token : string) : boolean {
            return this.isMatch;
        }

        //Methods for recursive descent parser - Start symbol: program.
        //Expected tokens - block, $
        public parseProgram() {
            //Add the program node to the tree. This should be the root node.
            this.CST.addNode("Program", "branch");

            //Begin parse block.
            this.parseBlock();

            //Check for EOP at the end of program.
            if(this.parseTokens[this.tokenPointer].getTokenValue() == "$") {
                _Functions.log("PARSER - Program successfully parsed.");

            }
        }

        //Expected tokens: { statementList }
        public parseBlock() {
            
        }

        //Expected tokens: statement statementList
        //OR - empty
        public parseStatementList() {
            // else {
            //     //Not an empty else, represents do nothing.
            // }
        }

        //Expected tokens: print, assignment, var declaration, while, if, block
        public parseStatement() {

        }

        //Expected tokens: print( expr )
        public parsePrintStatement() {

        }

        //Expected tokens: id = expr
        public parseAssignmentStatement() {

        }

        //Expected tokens: type id
        public parseVarDecl() {

        }

        //Expected tokens: while boolexpr block
        public parseWhileStatement() {

        }

        //Expected tokens: if boolexpr block
        public parseIfStatement() {

        }

        //Expected tokens: intexpr, stringexpr, boolexpr, id
        public parseExpr() {

        }

        //Expected tokens: digit intop expr
        //OR: digit
        public parseIntExpr() {

        }

        //Expected tokens: "charlist"
        public parseStringExpr() {

        }

        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        public parseBoolExpr() {

        }

        //Expected tokens: char
        public parseId() {

        }

        //Expected tokens: char charlist, space charlist, empty
        public parseCharList() {
            // else {
            //     //Not an empty else, represents do nothing.
            // }
        }

        //Expected tokens: int, string, boolean
        public parseType() {

        }

        //Expected tokens: a-z, A-Z
        public parseChar() {

        }

        //Expected tokens: space
        public parseSpace() {

        }

        //Expected tokens: 0-9
        public parseDigit() {

        }

        //Expected tokens: ==, !=
        public parseBoolOp() {

        }

        //Expected tokens: false, true
        public parseBoolVal() {

        }

        //Expected tokens: +
        public parseIntOp() {

        }

    }
}