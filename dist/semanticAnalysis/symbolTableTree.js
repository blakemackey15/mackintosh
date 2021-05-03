var mackintosh;
(function (mackintosh) {
    //Represents a node in the symbol table.
    var symbolTableNode = /** @class */ (function () {
        function symbolTableNode(map) {
            this.hashmap = map;
            this.children = [];
        }
        symbolTableNode.prototype.setMap = function (map) {
            this.hashmap = map;
        };
        symbolTableNode.prototype.getMap = function () {
            return this.hashmap;
        };
        symbolTableNode.prototype.setParentScope = function (parent) {
            this.parent = parent;
        };
        symbolTableNode.prototype.getParentScope = function () {
            return this.parent;
        };
        symbolTableNode.prototype.getChildren = function () {
            return this.children;
        };
        symbolTableNode.prototype.addChild = function (child) {
            this.children.push(child);
        };
        symbolTableNode.prototype.addSymbol = function (symbol, value) {
            if (this.hashmap.has(symbol)) {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Id has already been declared in this scope.");
            }
            else {
                this.hashmap.set(symbol, value);
            }
        };
        //Check if the scope has unused identifiers.
        symbolTableNode.prototype.hasUnusedIds = function () {
            for (var i = 0; i < this.hashmap.size; i++) {
                if (!this.hashmap.values()[i].getIsUsed()) {
                    return true;
                }
            }
            return false;
        };
        //Get the list of unused identifiers.
        symbolTableNode.prototype.getUnusedIds = function () {
            var unusedIds = [];
            for (var i = 0; i < this.hashmap.size; i++) {
                //Check if the symbol has not been used.
                if (!this.hashmap.values()[i].getIsUsed()) {
                    unusedIds.push(this.hashmap.keys[i]);
                }
            }
            //Return the list of unused ids.
            return unusedIds;
        };
        symbolTableNode.prototype.assignment = function (symbol, value) {
            var newScope = this.lookup(symbol);
            if (newScope == null) {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Id " + symbol + " has not been identified in symbol table.");
            }
            else {
                var type = newScope.getType();
                newScope.setValue(value);
                newScope.setIsUsed(true);
                this.hashmap.set(symbol, newScope);
            }
        };
        symbolTableNode.prototype.lookup = function (symbol) {
            if (this.hashmap.has(symbol)) {
                return this.hashmap.get(symbol);
            }
            //If it wasn't found and the parent isn't null check and see if its there.
            else if (this.parent != null) {
                this.parent.lookup(symbol);
            }
            return null;
        };
        symbolTableNode.prototype.checkType = function (value, type) {
            if (typeof value == type) {
                return true;
            }
            else {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Type mismatch, expected "
                    + typeof type + "but got " + typeof value + "instead.");
            }
        };
        return symbolTableNode;
    }());
    mackintosh.symbolTableNode = symbolTableNode;
    //Represent the symbol table tree.
    var symbolTableTree = /** @class */ (function () {
        function symbolTableTree() {
            this.rootNode = null;
        }
        symbolTableTree.prototype.getRoot = function () {
            return this.rootNode;
        };
        symbolTableTree.prototype.getCurNode = function () {
            return this.curNode;
        };
        symbolTableTree.prototype.addNode = function (map) {
            var node = new symbolTableNode(map);
            if (this.rootNode == null) {
                this.rootNode = node;
            }
            else {
                node.setParentScope(this.curNode);
                this.curNode.addChild(node);
            }
        };
        return symbolTableTree;
    }());
    mackintosh.symbolTableTree = symbolTableTree;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=symbolTableTree.js.map