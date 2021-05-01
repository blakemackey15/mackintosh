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
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Identifier " + newSymbol +
                    " has already been declared in current scope " + scopePointer + ".");
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
        symbolTableNode.prototype.getMap = function () {
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
        symbolTable.prototype.openScope = function (symbol, value, type) {
            var node = new symbolTableNode(symbol, value, type);
            //Check if this node is the root node.
            if (this.rootScope == null) {
                this.rootScope = node;
            }
            else {
                node.setParent(this.curScope);
                this.curScope.addChild(node);
            }
            this.curScope = node;
            return node;
        };
        symbolTable.prototype.checkType = function () {
        };
        //Returns if the scope has unused ids.
        symbolTable.prototype.hasUnusedIds = function (node) {
            var symbols = node.getMap();
            for (var i = 0; i < symbols.size; i++) {
                var entry = symbols.get(i);
                //Position 0 in the values table is isUsed, so lets get that one.
                if (!entry[0]) {
                    return true;
                }
            }
            //If we got here, there are no unused ids.
            return false;
        };
        //Gets the list of unused ids.
        symbolTable.prototype.findUnusedIds = function (node) {
            var symbols = node.getMap();
            var unused = new Array();
            for (var i = 0; i < symbols.size; i++) {
                var entry = symbols.get(i);
                //Position 0 in the values table is isUsed, so lets get that one.
                if (!entry[0]) {
                    unused.push(entry[0]);
                }
            }
            return unused;
        };
        symbolTable.prototype.lookup = function (symbol, node) {
            //Check if the entry has the symbol.
            if (this.curScope.getMap().has(symbol)) {
                return true;
            }
            //Check if the parent scope has the symbol.
            else if (this.curScope.getParent().getMap().has(symbol)) {
                return true;
            }
            else {
                return false;
            }
        };
        //Make the current scope the parent scope.
        symbolTable.prototype.closeScope = function () {
            if (this.curScope.getParent() !== undefined) {
                this.curScope = this.curScope.getParent();
            }
            //This shouldn't happen in theory but just in case it does.
            else {
                _Functions.log("SYMBOL TREE ERROR - Parent node does not exist.");
            }
        };
        return symbolTable;
    }());
    mackintosh.symbolTable = symbolTable;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=symbolTable.js.map