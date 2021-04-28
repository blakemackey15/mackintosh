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
        }
        return symbolTable;
    }());
    mackintosh.symbolTable = symbolTable;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=symbolTable.js.map