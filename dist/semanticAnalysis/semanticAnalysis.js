var mackintosh;
(function (mackintosh) {
    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    var semanticAnalyser = /** @class */ (function () {
        function semanticAnalyser() {
        }
        semanticAnalyser.semanticAnalysis = function () {
            debugger;
            scopePointer = 0;
            symbolTable = new mackintosh.symbolTableTree();
            semErr = 0;
            semWarn = 0;
            var isSemantic = false;
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("SEMANTIC ANALYSIS - Beginning Semantic Analysis " + (programCount - 1));
            try {
                this.analyzeBlock(ASTTree.getRoot());
                //this.traverseAST();
                _Functions.log("SEMANTIC ANALYSIS - Completed Semantic Analysis " + (programCount - 1) + " with "
                    + semErr + " errors and " + semWarn + " warnings.");
                if (semErr <= 0) {
                    isSemantic = true;
                    _Functions.log("\n");
                    _Functions.log("\n");
                    _Functions.log("SEMANTIC ANALYSIS - Program " + (programCount - 1) + " Symbol Table:");
                    _Functions.log("\n");
                    _Functions.log("-------------------------------");
                    _Functions.log("Symbol        Type        Scope");
                    _Functions.log("-------------------------------");
                    _Functions.log(symbolTable.toString());
                }
                else {
                    isSemantic = false;
                    _Functions.log("\n");
                    _Functions.log("\n");
                    _Functions.log("SEMANTIC ANALYSIS - Symbol table not displayed due to semantic analysis errors.");
                }
            }
            catch (error) {
                _Functions.log(error);
                _Functions.log("SEMANTIC ANALYSIS - Ended due to error.");
            }
            return isSemantic;
        };
        /*
            Method to traverse through the AST and perform semantic analysis.
            Based on the toString method. Instead of traversing and turning it into a string, semantic analysis will be
            performed on the AST.
            AST Nodes that are added to symbol table:
            VarDecl, while statement, if statement, print statement, assignment statement, block
        */
        semanticAnalyser.analyzeBlock = function (astNode) {
            //Open up a new scope and add it to the symbol table.
            //Once the recursion ends the scope will be closed.
            scopePointer++;
            var newScope;
            newScope = new Map();
            _Functions.log("SEMANTIC ANALYSIS - Block found, opening new scope " + scopePointer);
            symbolTable.addNode(newScope);
            if (astNode.getChildren().length != 0) {
                //Use recursion to travel through the nodes.
                for (var i = 0; i < astNode.getChildren().length; i++) {
                    this.analyzeStatement(astNode.getChildren()[i]);
                }
            }
            //this.analyzeStatement(astNode.getChildren()[0]);
            _Functions.log("SEMANTIC ANALYSIS - Closing scope " + scopePointer);
            symbolTable.closeScope();
            scopePointer--;
            //Add check for unused ids.
        };
        semanticAnalyser.analyzeStatement = function (astNode) {
            if (astNode.getNodeName() === "Block") {
                this.analyzeBlock(astNode);
            }
            if (astNode.getNodeName() === "VarDecl") {
                this.analyzeVarDecl(astNode);
            }
            if (astNode.getNodeName() === "PrintStatement") {
                this.analyzePrintStatement(astNode);
            }
            if (astNode.getNodeName() === "IfStatement") {
                this.analyzeIfStatement(astNode);
            }
            if (astNode.getNodeName() === "WhileStatement") {
                this.analyzeWhileStatement(astNode);
            }
            if (astNode.getNodeName() === "AssignmentStatement") {
                this.analyzeAssignmentStatement(astNode);
            }
        };
        semanticAnalyser.analyzeVarDecl = function (astNode) {
            //Add the symbol to the symbol table if it has not been declared already.
            _Functions.log("SEMANTIC ANALYSIS - VarDecl found.");
            //let map = symbolTable.getCurNode().getMap();
            var scopeType = astNode.getChildren()[0].getNodeName();
            var symbol = astNode.getChildren()[1].getNodeName();
            //This symbol has not been given a value, so it will be null for now.
            var scope = new mackintosh.scope(null, scopeType, scopePointer);
            var current = symbolTable.getCurNode();
            symbolTable.getCurNode().addSymbol(symbol, scope);
        };
        semanticAnalyser.analyzePrintStatement = function (astNode) {
            _Functions.log("SEMANTIC ANALYSIS - Print Statement found.");
            var symbol = astNode.getChildren()[0].getNodeName();
            //Check if the symbol to be printed is in the symbol table.
            if (symbolTable.getCurNode().lookup(symbol) != null) {
                _Functions.log(symbolTable.getCurNode().lookup(symbol));
                _Functions.log("SEMANTIC ANALYSIS - Print " + symbol);
            }
            else {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Symbol " + symbol + " does not exist in symbol table");
            }
        };
        semanticAnalyser.analyzeIfStatement = function (astNode) {
            _Functions.log("SEMANTIC ANALYSIS - If Statement found.");
            //Check if both ends of the statement are in the symbol table
            _Functions.log("SEMANTIC ANALYSIS - While Statement found.");
            var if1 = astNode.getChildren()[0].getChildren()[0].getNodeName();
            var if2 = astNode.getChildren()[0].getChildren()[1].getNodeName();
            if (symbolTable.getCurNode().lookup(if1) != null
                && symbolTable.getCurNode().lookup(if2) != null) {
                _Functions.log("SEMANTIC ANALYSIS - If " + if1 + " " +
                    astNode.getChildren()[0].getNodeName() + " " + if2);
            }
            if (astNode.getChildren().length > 1) {
                for (var i = 1; i < astNode.getChildren().length; i++) {
                    this.analyzeStatement(astNode.getChildren()[i]);
                }
            }
        };
        semanticAnalyser.analyzeWhileStatement = function (astNode) {
            //Check if both ends of the statement are in the symbol table
            _Functions.log("SEMANTIC ANALYSIS - While Statement found.");
            var while1 = astNode.getChildren()[0].getChildren()[0].getNodeName();
            var while2 = astNode.getChildren()[0].getChildren()[1].getNodeName();
            if (symbolTable.getCurNode().lookup(while1) != null
                && symbolTable.getCurNode().lookup(while2) != null) {
                _Functions.log("SEMANTIC ANALYSIS - While " +
                    while1 + " " + astNode.getChildren()[0].getNodeName() + " " + while2);
            }
            if (astNode.getChildren().length > 1) {
                for (var i = 1; i < astNode.getChildren().length; i++) {
                    this.analyzeStatement(astNode.getChildren()[i]);
                }
            }
        };
        semanticAnalyser.analyzeAssignmentStatement = function (astNode) {
            _Functions.log("SEMANTIC ANALYSIS - Assignment Statement found.");
            var symbol = astNode.getChildren()[0].getNodeName();
            var value = astNode.getChildren()[1].getNodeName();
            var curSymbol = symbolTable.getCurNode().lookup(symbol);
            var expectedDataType;
            var dataType;
            if (symbolTable.getCurNode().lookup(symbol) == null) {
                throw new Error("SEMANTIC ANALYSIS - Symbol does not exist in symbol table.");
            }
            else {
                //Check if the value is an id, int, string, or boolean.
                if (characters.test(value) && value.length == 1) {
                    var newSymbol = symbolTable.getCurNode().lookup(value);
                    //Check the type of the two ids and make sure they are assignable.
                    if (newSymbol.getType() != curSymbol.getType()) {
                        throw new Error("SEMANTIC ANALYSIS - Type Mismatch: symbol " + symbol +
                            " with type " + curSymbol.getType() + " cannot be assigned to "
                            + value + " with type " + newSymbol.getType());
                    }
                    else if (newSymbol.getValue() == null) {
                        semWarn++;
                        _Functions.log("SEMANTIC ANALYSIS - Symbol " + symbol +
                            " is being assigned to symbol " + value + " with no value.");
                        symbolTable.getCurNode().assignment(symbol, null);
                    }
                    //Assign the variable.
                    else {
                        symbolTable.getCurNode().assignment(symbol, newSymbol.getValue());
                    }
                }
                else if (value === "true" || value === "false") {
                    expectedDataType = true;
                }
                else if (quotes.test(value)) {
                    var i = 2;
                    while (!quotes.test(astNode.getChildren()[i].getNodeName())) {
                        value += astNode.getChildren()[i].getNodeName();
                        i++;
                    }
                    value += '"';
                    expectedDataType = "dsadsa";
                }
                else if (digits.test(value)) {
                    expectedDataType = 1;
                }
                if (intRegEx.test(curSymbol.getType())) {
                    dataType = 1;
                }
                else if (stringRegEx.test(curSymbol.getType())) {
                    dataType = "xcsadsa";
                }
                else if (boolRegEx.test(curSymbol.getType())) {
                    dataType = true;
                }
                if (this.checkType(expectedDataType, dataType)) {
                    _Functions.log("SEMANTIC ANALYSIS - Performing assignment " + symbol + " " + value);
                    symbolTable.getCurNode().assignment(symbol, value);
                }
            }
        };
        //Check the type or report type mismatch error.
        semanticAnalyser.checkType = function (expected, actual) {
            if (typeof expected == typeof actual) {
                return true;
            }
            else {
                throw new Error("SEMANTIC ANALYSIS - Type mismatch error expected "
                    + typeof expected + " but got " + typeof actual);
            }
        };
        //Method to go through the symbol table and find unused ids.
        semanticAnalyser.findUnusedIds = function () {
            var unusedIds = [];
            function expand(node, depth) {
                for (var i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren()[i], depth + 1);
                }
            }
            expand(symbolTable.getRoot(), 0);
        };
        return semanticAnalyser;
    }());
    mackintosh.semanticAnalyser = semanticAnalyser;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=semanticAnalysis.js.map