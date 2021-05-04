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
                    _Functions.log("Symbol  Type  Value  isUsed");
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
            var scope = symbolTable.getCurNode().getMap().get(symbol);
            var dataValue;
            var dataType;
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
            var symbolExists = symbolTable.getCurNode().lookup(symbol);
            //Check if the symbol is in the table.
            if (symbolExists == null) {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Symbol " + symbol + " does not exist in current scope.");
            }
            else {
                var scopeType = symbolExists.getType();
                if (intRegEx.test(scopeType)) {
                    dataType = scopeType;
                }
                else if (stringRegEx.test(scopeType)) {
                    dataType = scopeType;
                }
                else if (boolRegEx.test(scopeType) || falseRegEx.test(scopeType)) {
                    dataType = scopeType;
                }
                if (symbolTable.getCurNode().checkType(dataValue, dataType)) {
                    symbolTable.getCurNode().assignment(symbol, dataValue);
                }
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