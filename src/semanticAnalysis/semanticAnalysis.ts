module mackintosh {


    export class semanticAnalyser {
        //AST and symbol table implementations.
        public static semAnalysis () {
            debugger;
            //Reset gloabl variables.
            symbolTable = new Map();
            scopePointer = 0;
            isInitialized = false;
            isUsed = false;
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("SEMANTIC ANALYZER - Semantic Analysis " + (programCount - 1));

        }
    }
}