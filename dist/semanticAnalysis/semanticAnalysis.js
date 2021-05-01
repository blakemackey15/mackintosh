var mackintosh;
(function (mackintosh) {
    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    var semanticAnalyser = /** @class */ (function () {
        function semanticAnalyser() {
        }
        semanticAnalyser.semanticAnalysis = function () {
            try {
                scopePointer = 0;
                symbolTable = new mackintosh.symbolTableTree();
                _Functions.log("SEMANTIC ANALYSIS - Beginning Semantic Analysis " + (programCount - 1));
            }
            catch (error) {
                _Functions.log(error);
                _Functions.log("SEMANTIC ANALYSIS - Ended due to error.");
            }
            //symbolTable.traverseAST(ASTTree);
        };
        /*
            Method to traverse through the AST and perform semantic analysis.
            Based on the toString method. Instead of traversing and turning it into a string, semantic analysis will be
            performed on the AST.
        */
        semanticAnalyser.traverseAST = function () {
            function expand(node, depth) {
                var scopeVal = new mackintosh.scope(null, null);
                var map = new Map();
                //Check node names. Then, perform the correct analysis.
                if (node.getNodeName() == "Block") {
                    scopeVal = semanticBlock(map, node, scopeVal);
                }
                if (node.getNodeName() == "PrintStatement") {
                }
                if (node.getNodeName() == "AssignmentStatement") {
                }
                if (node.getNodeName() == "VarDecl") {
                    semanticVarDecl(map, node, scopeVal);
                }
                if (node.getNodeName() == "WhileStatement") {
                }
                if (node.getNodeName() == "IfStatement") {
                }
                //Continue on to the next nodes in the tree.
                for (var i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren()[i], depth + 1);
                }
            }
            function semanticBlock(map, node, scope) {
                scopePointer++;
                _Functions.log("SEMANTIC ANALYSIS - Found Block, opening new scope " + scopePointer);
                scope.setType(null);
                scope.setValue(null);
                return scope;
            }
            function semanticPrintStatement(map, node) {
            }
            function semanticAssignmentStatement(map, node, scope) {
                var children = node.getChildren();
                var symbol = children[0].getNodeName();
                var value = children[1].getNodeName();
                scope.setValue(value);
                //Check if the symbol is in the map. If not, throw an error.
                if (map.has(symbol)) {
                    map.set(symbol, scope);
                }
                //Check if the parent scopes have the symbol.
                else if (symbolTable.getCurNode().getParentScope().getMap().has(symbol)) {
                }
                else {
                    throw new Error("SEMANTIC ANALYSIS - Symbo");
                }
            }
            function semanticVarDecl(map, node, scope) {
                //Get the children and their names, and then add them to the map.
                var children = node.getChildren();
                var type = children[0].getNodeName();
                var symbol = children[1].getNodeName();
                //Define the value of the scope, and then add it to the tree.
                scope.setType(type);
                map.set(symbol, scope);
                symbolTable.addNode(map);
            }
            function semanticWhileStatement(map, node) {
            }
            function semanticIfStatement(map, node) {
            }
            //Start from the root node.
            expand(ASTTree.getRoot(), 0);
        };
        return semanticAnalyser;
    }());
    mackintosh.semanticAnalyser = semanticAnalyser;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=semanticAnalysis.js.map