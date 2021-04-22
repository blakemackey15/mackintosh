module mackintosh {


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
            _Functions.log("SEMANTIC ANALYZER - Close block found: Closing scope" + scopePointer);
            scopePointer--;
            
        }
    }
}