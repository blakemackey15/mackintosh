var mackintosh;
(function (mackintosh) {
    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    var semanticAnalyser = /** @class */ (function () {
        function semanticAnalyser() {
        }
        //AST and symbol table implementations.
        semanticAnalyser.semAnalysis = function () {
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
            var values = new Array();
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("SEMANTIC ANALYZER - Beginning Semantic Analysis Program " + (programCount - 1));
            try {
                this.analyzeProgram();
            }
            catch (error) {
                _Functions.log("SEMANTIC ANALYZER - Semantic Analysis ended due to error.");
            }
        };
        semanticAnalyser.analyzeProgram = function () {
            this.analyzeBlock();
        };
        semanticAnalyser.analyzeBlock = function () {
            //A new block means new scope. Open and close scope when token pointer is equal to { or }
            //Initilize a new scope map, and then add it to the symbol table.
            scopePointer++;
            _Functions.log("SEMANTIC ANALYZER - Block found: Opening new scope " + scopePointer);
            //Call analyze statement list to check the statement within the block.
            this.analyzeStatementList();
            _Functions.log("SEMANTIC ANALYZER - Close block found: Closing scope" + scopePointer);
            scopePointer--;
        };
        semanticAnalyser.analyzeStatementList = function () {
            _Functions.log("SEMANTIC ANALYZER - analyzeStatementList()");
        };
        semanticAnalyser.analyzePrintStatement = function () {
            _Functions.log("PARSER - analyzePrintStatement");
        };
        semanticAnalyser.analyzeAssignmentStatement = function () {
            _Functions.log("PARSER - analyzeAssignmentStatement()");
        };
        semanticAnalyser.analyzeVarDecl = function () {
            _Functions.log("PARSER - analyzeVarDecl()");
        };
        semanticAnalyser.analyzeWhileStatement = function () {
            _Functions.log("PARSER - analyzeWhileStatement()");
        };
        semanticAnalyser.analyzeIfStatement = function () {
            _Functions.log("PARSER - analyzeIfStatement()");
        };
        return semanticAnalyser;
    }());
    mackintosh.semanticAnalyser = semanticAnalyser;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=semanticAnalysis.js.map