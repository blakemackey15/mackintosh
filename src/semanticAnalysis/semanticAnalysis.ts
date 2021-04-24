module mackintosh {

    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    export class semanticAnalyser {
        //AST and symbol table implementations.
        public static semAnalysis (tokenStream : Array<string>) {
            debugger;
            //Reset gloabl variables.
            symbolTable = new Map();
            scopePointer = 0;
            isInitialized = false;
            isUsed = false;
            tokenPointer = 0;
            //Represents map values when adding new entry to symbol table.
            //Map key: symbol
            //Values order: Type, Scope, Line
            let values = new Array<any>();

            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("SEMANTIC ANALYZER - Beginning Semantic Analysis " + (programCount - 1));

            try {
                this.analyzeProgram(tokenStream);
            } catch (error) {
                _Functions.log("SEMANTIC ANALYZER - Semantic Analysis ended due to error.");
            }
        }

        public static analyzeProgram(tokenStream : Array<string>) {
            this.analyzeBlock(tokenStream);
        }

        public static analyzeBlock(tokenStream : Array<string>) {
            //A new block means new scope. Open and close scope when token pointer is equal to { or }
            scopePointer++;
            _Functions.log("SEMANTIC ANALYZER - Block found: Opening new scope " + scopePointer);
            //Call analyze statement list to check the statement within the block.
            this.analyzeStatementList(tokenStream);
            _Functions.log("SEMANTIC ANALYZER - Close block found: Closing scope" + scopePointer);
            scopePointer--;
            
        }

        public static analyzeStatementList(tokenStream : Array<string>) {
            _Functions.log("SEMANTIC ANALYZER - analyzeStatementList()");
            while(tokenStream[tokenPointer] != "}") {
                _Functions.log("PARSER - parseStatement()");

                if(printRegEx.test(tokenStream[tokenPointer])){
                    this.analyzePrintStatement(tokenStream);
                }

                //Check for assignment op.
                else if(assignment.test(tokenStream[tokenPointer + 1])) {
                    this.analyzeAssignmentStatement(tokenStream);
                }

                //Check for var declaration types - boolean, int, string.
                else if(boolRegEx.test(tokenStream[tokenPointer]) || stringRegEx.test(tokenStream[tokenPointer]) 
                || intRegEx.test(tokenStream[tokenPointer])) {
                    this.analyzeVarDecl(tokenStream);
                }

                //Check for while statement.
                else if(whileRegEx.test(tokenStream[tokenPointer])) {
                    this.analyzeWhileStatement(tokenStream);
                }

                //Check for if statement.
                else if(ifRegEx.test(tokenStream[tokenPointer])) {
                    this.analyzeIfStatement(tokenStream);
                }

                //Check for opening or closing block.
                else if(leftBlock.test(tokenStream[tokenPointer])) {
                    this.analyzeBlock(tokenStream);
                }
            }
        }

        public static analyzePrintStatement(tokenStream : Array<string>) {
            _Functions.log("PARSER - analyzePrintStatement");

        }

        public static analyzeAssignmentStatement(tokenStream : Array<string>) {
            _Functions.log("PARSER - analyzeAssignmentStatement()");

        }

        public static analyzeVarDecl(tokenStream : Array<string>) {
            _Functions.log("PARSER - analyzeVarDecl()");

        }

        public static analyzeWhileStatement(tokenStream : Array<string>) {
            _Functions.log("PARSER - analyzeWhileStatement()");

        }

        public static analyzeIfStatement(tokenStream : Array<string>) {
            _Functions.log("PARSER - analyzeIfStatement()");

        }
    }
}