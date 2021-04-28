var mackintosh;
(function (mackintosh) {
    //Represents a node in the symbol table tree.
    var symbolTableNode = /** @class */ (function () {
        //Takes in the symbol, value, and type of an entry in the symbol table.
        //The symbol is the key in the hash map entry.
        function symbolTableNode(symbol, value, type) {
            this.symbolTableEntry = new Map();
            this.isUsed = false;
            this.value = value;
            this.type = type;
            this.symbol = symbol;
        }
        symbolTableNode.prototype.setValue = function (value) {
            this.value = value;
        };
        symbolTableNode.prototype.getValue = function () {
            return this.value;
        };
        symbolTableNode.prototype.setType = function (type) {
            this.type = type;
        };
        symbolTableNode.prototype.getType = function () {
            return this.type;
        };
        symbolTableNode.prototype.setSymbol = function (symbol) {
            this.symbol = symbol;
        };
        symbolTableNode.prototype.getSymbol = function () {
            return this.symbol;
        };
        symbolTableNode.prototype.setIsUsed = function (isUsed) {
            this.isUsed = isUsed;
        };
        symbolTableNode.prototype.getIsUsed = function () {
            return this.isUsed;
        };
        symbolTableNode.prototype.setParent = function (entry) {
            this.parent = entry;
        };
        symbolTableNode.prototype.getParent = function () {
            return this.parent;
        };
        symbolTableNode.prototype.addChild = function (child) {
            this.children.push(child);
        };
        symbolTableNode.prototype.getChildren = function () {
            return this.children;
        };
        symbolTableNode.prototype.createEntry = function (newSymbol) {
            //Check if the symbol already exists in the symbol table.
            if (this.symbol == this.symbolTableEntry.get(newSymbol)) {
                _Functions.log("SEMANTIC ANALYSIS ERROR - Identifier" + newSymbol +
                    "has already been declared in current scope.");
                semErr++;
            }
            else {
                var values = new Array();
                //1st entry - type.
                //2nd entry - value.
                //3rd entry - used.
                values.push(this.getType());
                values.push(this.getValue());
                values.push(this.getIsUsed());
                this.symbolTableEntry.set(this.getSymbol(), values);
            }
        };
        symbolTableNode.prototype.lookup = function (symbol) {
            if (this.symbolTableEntry.has(symbol)) {
                return this.symbolTableEntry.get(symbol);
            }
            else {
                _Functions.log("SEMANTIC ANALYSIS ERROR - Identifier " + symbol
                    + " was used before being initialized.");
            }
        };
        symbolTableNode.prototype.getEntry = function () {
            return this.symbolTableEntry;
        };
        return symbolTableNode;
    }());
    mackintosh.symbolTableNode = symbolTableNode;
    var symbolTable = /** @class */ (function () {
        function symbolTable() {
            this.rootScope = null;
        }
        symbolTable.prototype.getRootScope = function () {
            return this.rootScope;
        };
        symbolTable.prototype.getCurScope = function () {
            return this.curScope;
        };
        //Add a node to the symbol table tree.
        symbolTable.prototype.addNode = function (symbol, value, type, kind) {
            var node = new symbolTableNode(symbol, value, type);
            //Check if this node is the root node.
            if (this.rootScope == null) {
                this.rootScope = null;
            }
            else {
                node.setParent(this.curScope);
                this.curScope.addChild(node);
            }
            //Update the current scope and add an entry to the symbol table.
            this.curScope = node;
            node.createEntry(symbol);
        };
        //Make the current scope the parent scope.
        symbolTable.prototype.closeScope = function () {
            if (this.curScope.getParent() !== null) {
                this.curScope = this.curScope.getParent();
            }
            //This shouldn't happen in theory but just in case it does.
            else {
                _Functions.log("SYMBOL TREE ERROR - Parent node does not exist.");
            }
        };
        //Traverse the AST and add the symbols to an array.
        symbolTable.prototype.traverseAST = function (ASTTree) {
            //Create an array to store the symbols while traversing the tree.
            var symbols = new Array();
            function expand(node, depth) {
                //Found a leaf node, add it to the symbols array.
                if (node.getChildren().length === 0) {
                    symbols.push(node.getNodeName());
                }
                //Traverse through tree and find named nodes.
                else {
                    for (var i = 0; i < node.getChildren().length; i++) {
                        expand(node.getChildren()[i], depth + 1);
                    }
                }
            }
            expand(ASTTree.getRoot(), 0);
            _Functions.log(symbols.toString());
            return symbols;
        };
        return symbolTable;
    }());
    mackintosh.symbolTable = symbolTable;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=symbolTable.js.map