module mackintosh {

    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    export class semanticAnalyser {
        //AST and symbol table implementations.
        public static semAnalysis () {
            debugger;
            //Reset gloabl variables.
            curScope = new Map();
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
            _Functions.log("SEMANTIC ANALYZER - Beginning Semantic Analysis Program " + (programCount - 1));

            try {
                this.analyzeProgram();
            } catch (error) {
                _Functions.log("SEMANTIC ANALYZER - Semantic Analysis ended due to error.");
            }
        }

        public static analyzeProgram() {
            this.analyzeBlock();
        }

        public static analyzeBlock() {
            //A new block means new scope. Open and close scope when token pointer is equal to { or }
            //Initilize a new scope map, and then add it to the symbol table.
            scopePointer++;
            _Functions.log("SEMANTIC ANALYZER - Block found: Opening new scope " + scopePointer);
            
            //Call analyze statement list to check the statement within the block.
            this.analyzeStatementList();
            _Functions.log("SEMANTIC ANALYZER - Close block found: Closing scope" + scopePointer);
            scopePointer--;
            
        }

        public static analyzeStatementList() {
            _Functions.log("SEMANTIC ANALYZER - analyzeStatementList()");
        }

        public static analyzePrintStatement() {
            _Functions.log("PARSER - analyzePrintStatement");

        }

        public static analyzeAssignmentStatement() {
            _Functions.log("PARSER - analyzeAssignmentStatement()");

        }

        public static analyzeVarDecl() {
            _Functions.log("PARSER - analyzeVarDecl()");

        }

        public static analyzeWhileStatement() {
            _Functions.log("PARSER - analyzeWhileStatement()");

        }

        public static analyzeIfStatement() {
            _Functions.log("PARSER - analyzeIfStatement()");

        }
    }
}