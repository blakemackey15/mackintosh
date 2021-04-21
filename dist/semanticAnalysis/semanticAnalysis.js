var mackintosh;
(function (mackintosh) {
    var semanticAnalyser = /** @class */ (function () {
        function semanticAnalyser() {
        }
        //AST and symbol table implementations.
        semanticAnalyser.semAnalysis = function () {
            debugger;
            //Reset gloabl variables.
            symbolTable = new Map();
            scopePointer = 0;
            isInitialized = false;
            isUsed = false;
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("SEMANTIC ANALYZER - Semantic Analysis " + (programCount - 1));
        };
        return semanticAnalyser;
    }());
    mackintosh.semanticAnalyser = semanticAnalyser;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=semanticAnalysis.js.map