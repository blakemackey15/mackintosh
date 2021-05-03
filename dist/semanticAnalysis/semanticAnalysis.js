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
                _Functions.log("\n");
                _Functions.log("\n");
                _Functions.log("SEMANTIC ANALYSIS - Beginning Semantic Analysis " + (programCount - 1));
                this.traverseAST();
            }
            catch (error) {
                _Functions.log(error);
                _Functions.log("SEMANTIC ANALYSIS - Ended due to error.");
            }
        };
        /*
            Method to traverse through the AST and perform semantic analysis.
            Based on the toString method. Instead of traversing and turning it into a string, semantic analysis will be
            performed on the AST.
        */
        semanticAnalyser.traverseAST = function () {
            //Function to traverse through the AST and build the symbol table.
            function expand(node, depth) {
                //Depth first in order traversal through the array of children to get the nodes.
                /*
                    AST Nodes that are added to symbol table:
                    VarDecl, while statement, if statement, print statement, assignment statement, block
                */
                if (node.getNodeName() === "Block") {
                    //Open up a new scope and add it to the symbol table.
                    scopePointer++;
                    var newScope = void 0;
                    var scope_1;
                    _Functions.log("SEMANTIC ANALYSIS - Block found, opening new scope " + scopePointer);
                    symbolTable.addNode(newScope);
                }
                if (node.getNodeName() === "VarDecl") {
                    //Add the symbol to the symbol table if it has not been declared already.
                    _Functions.log("SEMANTIC ANALYSIS - VarDecl found.");
                    //let map = symbolTable.getCurNode().getMap();
                    var type = node.getChildren()[0].getNodeName();
                    var symbol = node.getChildren()[1].getNodeName();
                    //This symbol has not been given a value, so it will be null for now.
                    var scope_2 = new mackintosh.scope(null, type);
                    symbolTable.getCurNode().addSymbol(symbol, scope_2);
                }
                if (node.getNodeName() === "AssignmentStatement") {
                    _Functions.log("SEMANTIC ANALYSIS - Assignment Statement found.");
                    var symbol = node.getChildren()[0].getNodeName();
                    var value = node.getChildren()[1].getNodeName();
                    var dataValue = void 0;
                    var dataType = void 0;
                    //Cast the value to the corresponding data type.
                    if (digits.test(value)) {
                        dataValue = value;
                    }
                    else if (characters.test(value)) {
                        dataValue = value;
                    }
                    else if (trueRegEx.test(value) || falseRegEx.test(value)) {
                        dataValue = value;
                    }
                    var symbolExists = symbolTable.getCurNode().getMap().get(symbol);
                    //Check if the symbol is in the table.
                    if (symbolExists == null) {
                        semErr++;
                        throw new Error("SEMANTIC ANALYSIS - Symbol " + symbol + " does not exist in current scope.");
                    }
                    else {
                        var type = symbolExists.getType();
                        if (digits.test(type)) {
                            dataType = type;
                        }
                        else if (characters.test(value)) {
                            dataType = type;
                        }
                        else if (trueRegEx.test(type) || falseRegEx.test(type)) {
                            dataType = type;
                        }
                        if (symbolTable.getCurNode().checkType(dataValue, dataType)) {
                            symbolTable.getCurNode().assignment(symbol, dataValue);
                        }
                    }
                }
                if (node.getNodeName() === "WhileStatement") {
                    //Check if both ends of the statement are in the symbol table
                    _Functions.log("SEMANTIC ANALYSIS - While Statement found.");
                    var assign1 = symbolTable.getCurNode().getChildren()[0].getChildren()[0];
                    var assign2 = symbolTable.getCurNode().getChildren()[0].getChildren()[1];
                    if (symbolTable.getCurNode().lookup(assign1) != null
                        && symbolTable.getCurNode().lookup(assign2) != null) {
                        _Functions.log("SEMANTIC ANALYSIS - While " +
                            assign1 + symbolTable.getCurNode().getChildren()[0] + assign2);
                    }
                }
                if (node.getNodeName() === "IfStatement") {
                    _Functions.log("SEMANTIC ANALYSIS - If Statement found.");
                    //Check if both ends of the statement are in the symbol table
                    _Functions.log("SEMANTIC ANALYSIS - While Statement found.");
                    var if1 = symbolTable.getCurNode().getChildren()[0].getChildren()[0];
                    var if2 = symbolTable.getCurNode().getChildren()[0].getChildren()[1];
                    if (symbolTable.getCurNode().lookup(if1) != null
                        && symbolTable.getCurNode().lookup(if2) != null) {
                        _Functions.log("SEMANTIC ANALYSIS - While " + if1 +
                            symbolTable.getCurNode().getChildren()[0] + if2);
                    }
                }
                if (node.getNodeName() === "PrintStatement") {
                    _Functions.log("SEMANTIC ANALYSIS - Print Statement found.");
                    var symbol = node.getChildren()[0].getNodeName();
                    //Check if the symbol to be printed is in the symbol table.
                    if (symbolTable.getCurNode().lookup(symbol) != null) {
                        _Functions.log("SEMANTIC ANALYSIS - Print " + symbol);
                    }
                    else {
                        semErr++;
                        throw new Error("SEMANTIC ANALYSIS - Symbol " + symbol + " does not exist in symbol table");
                    }
                }
                for (var i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren[i], depth + 1);
                }
            }
            expand(ASTTree.getRoot(), 0);
            return symbolTable;
        };
        return semanticAnalyser;
    }());
    mackintosh.semanticAnalyser = semanticAnalyser;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=semanticAnalysis.js.map