var mackintosh;
(function (mackintosh) {
    //Represents a node in the symbol table.
    var symbolTableNode = /** @class */ (function () {
        function symbolTableNode(map) {
            this.hashmap = map;
            this.children = [];
            this.parent = null;
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
            else if (this.parent !== null) {
                return this.parent.lookup(symbol);
            }
            return null;
        };
        symbolTableNode.prototype.checkType = function (value, scopeType) {
            //Change to the correct data type.
            var dataType;
            if (digits.test(value)) {
                dataType = "int";
            }
            if (characters.test(value)) {
                dataType = "string";
            }
            if (trueRegEx.test(value) || falseRegEx.test(value)) {
                dataType = "boolean";
            }
            if (scopeType == dataType) {
                return true;
            }
            else {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Type mismatch, expected "
                    + scopeType + " but got " + dataType + " instead.");
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
            this.curNode = node;
        };
        symbolTableTree.prototype.closeScope = function () {
            //Move up the tree to parent node.
            if (this.curNode.getParentScope() !== null && this.curNode.getParentScope() !== undefined) {
                this.curNode = this.curNode.getParentScope();
            }
            else if (this.curNode == this.rootNode) {
                return;
            }
            else {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Parent scope does not exist.");
            }
        };
        symbolTableTree.prototype.toString = function () {
            var tableString = "";
            function expand(node, depth) {
                for (var i = 0; i < depth; i++) {
                    //tableString += "Scope " + i + "\n";
                }
                //Iterate through each key value pair and add them to the tree.
                var map = node.getMap();
                map.forEach(function (value, key) {
                    tableString += key + "            " + value.getValue() +
                        "            " + value.getScopePointer() + "\n";
                });
                for (var i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren()[i], depth + 1);
                }
            }
            expand(this.rootNode, 0);
            return tableString;
        };
        return symbolTableTree;
    }());
    mackintosh.symbolTableTree = symbolTableTree;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=symbolTableTree.js.map