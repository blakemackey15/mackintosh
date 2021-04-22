var mackintosh;
(function (mackintosh) {
    var semanticAnalyser = /** @class */ (function () {
        function semanticAnalyser() {
        }
        //AST and symbol table implementations.
        semanticAnalyser.semAnalysis = function (tokenStream) {
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
            var values = new Array();
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("SEMANTIC ANALYZER - Beginning Semantic Analysis " + (programCount - 1));
            try {
                this.analyzeProgram(tokenStream);
            }
            catch (error) {
                _Functions.log("SEMANTIC ANALYZER - Semantic Analysis ended due to error.");
            }
        };
        semanticAnalyser.analyzeProgram = function (tokenStream) {
            this.analyzeBlock(tokenStream);
        };
        semanticAnalyser.analyzeBlock = function (tokenStream) {
            //A new block means new scope. Open and close scope when token pointer is equal to { or }
            scopePointer++;
            _Functions.log("SEMANTIC ANALYZER - Block found: Opening new scope " + scopePointer);
            _Functions.log("SEMANTIC ANALYZER - Close block found: Closing scope" + scopePointer);
            scopePointer--;
        };
        return semanticAnalyser;
    }());
    mackintosh.semanticAnalyser = semanticAnalyser;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=semanticAnalysis.js.map