var mackintosh;
(function (mackintosh) {
    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    var semanticAnalyser = /** @class */ (function () {
        function semanticAnalyser() {
        }
        semanticAnalyser.semAnalysis = function () {
            try {
                scopePointer = 0;
                _Functions.log("SEMANTIC ANALYSIS - Beginning Semantic Analysis " + (programCount - 1));
            }
            catch (error) {
                _Functions.log(error);
                _Functions.log("SEMANTIC ANALYSIS - Ended due to error.");
            }
            //symbolTable.traverseAST(ASTTree);
        };
        return semanticAnalyser;
    }());
    mackintosh.semanticAnalyser = semanticAnalyser;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=semanticAnalysis.js.map