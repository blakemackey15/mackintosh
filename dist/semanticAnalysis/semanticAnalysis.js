var mackintosh;
(function (mackintosh) {
    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    var semanticAnalyser = /** @class */ (function () {
        function semanticAnalyser() {
        }
        semanticAnalyser.semAnalysis = function () {
            try {
                var symbolTable_1 = new mackintosh.symbolTable;
                scopePointer = 0;
                _Functions.log("SEMANTIC ANALYSIS - Beginning Semantic Analysis " + (programCount - 1));
                this.semProgram(symbolTable_1, symbolTable_1.getRootScope(), ASTTree.getRoot());
            }
            catch (error) {
                _Functions.log(error);
                _Functions.log("SEMANTIC ANALYSIS - Ended due to error.");
            }
            //symbolTable.traverseAST(ASTTree);
        };
        //Begin semantic analysis methods.
        semanticAnalyser.semProgram = function (symbolTable, node, astNode) {
            this.semBlock(symbolTable, node, astNode);
        };
        semanticAnalyser.semBlock = function (symbolTable, node, astNode) {
            scopePointer++;
            _Functions.log("SEMANTIC ANALYSIS - Opening new scope: " + scopePointer);
            //Close the scope when recursion is over.
            _Functions.log("SEMANTIC ANALYSIS - Closing scope: " + scopePointer);
            symbolTable.closeScope();
        };
        return semanticAnalyser;
    }());
    mackintosh.semanticAnalyser = semanticAnalyser;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=semanticAnalysis.js.map