var mackintosh;
(function (mackintosh) {
    var semanticAnalyser = /** @class */ (function () {
        function semanticAnalyser() {
        }
        //AST and symbol table implementations.
        semanticAnalyser.createAST = function (parseTokens) {
            ASTTree = new mackintosh.AST();
        };
        return semanticAnalyser;
    }());
    mackintosh.semanticAnalyser = semanticAnalyser;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=semanticAnalysis.js.map