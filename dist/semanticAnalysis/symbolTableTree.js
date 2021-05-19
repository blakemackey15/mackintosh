var mackintosh;
(function (mackintosh) {
    //Represents a node in the symbol table.
    class symbolTableNode {
        constructor(map) {
            this.hashmap = map;
            this.children = [];
            this.parent = null;
        }
        setMap(map) {
            this.hashmap = map;
        }
        getMap() {
            return this.hashmap;
        }
        setParentScope(parent) {
            this.parent = parent;
        }
        getParentScope() {
            return this.parent;
        }
        getChildren() {
            return this.children;
        }
        addChild(child) {
            this.children.push(child);
        }
        addSymbol(symbol, value) {
            if (this.hashmap.has(symbol)) {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Id has already been declared in this scope.");
            }
            else {
                this.hashmap.set(symbol, value);
            }
        }
        //Get the list of unused identifiers.
        getUnusedIds() {
            let unusedIds = [];
            this.hashmap.forEach((value, key) => {
                if (!value.getIsUsed()) {
                    unusedIds.push(key);
                }
            });
            //Return the list of unused ids.
            return unusedIds;
        }
        assignment(symbol, value) {
            let newScope = this.lookup(symbol);
            if (newScope == null) {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Id " + symbol + " has not been identified in symbol table.");
            }
            else {
                let type = newScope.getType();
                newScope.setValue(value);
                newScope.setIsUsed(true);
                this.hashmap.set(symbol, newScope);
            }
        }
        lookup(symbol) {
            if (this.hashmap.has(symbol)) {
                return this.hashmap.get(symbol);
            }
            //If it wasn't found and the parent isn't null check and see if its there.
            else if (this.parent !== null) {
                return this.parent.lookup(symbol);
            }
            return null;
        }
    }
    mackintosh.symbolTableNode = symbolTableNode;
    //Represent the symbol table tree.
    class symbolTableTree {
        constructor() {
            this.rootNode = null;
        }
        getRoot() {
            return this.rootNode;
        }
        getCurNode() {
            return this.curNode;
        }
        addNode(map) {
            let node = new symbolTableNode(map);
            if (this.rootNode == null) {
                this.rootNode = node;
            }
            else {
                node.setParentScope(this.curNode);
                this.curNode.addChild(node);
            }
            this.curNode = node;
        }
        closeScope() {
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
        }
        toString() {
            let tableString = "";
            function expand(node, depth) {
                //Iterate through each key value pair and add them to the tree.
                let map = node.getMap();
                map.forEach((value, key) => {
                    tableString += key + "            " + value.getType() +
                        "            " + value.getScopePointer() + "\n";
                });
                for (let i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren()[i], depth + 1);
                }
            }
            expand(this.rootNode, 0);
            return tableString;
        }
        getNode(curScope, id) {
            let foundNode;
            function expand(node, depth, id, curScope) {
                let map = node.getMap();
                map.forEach((value, key) => {
                    if (curScope == value.getScopePointer()) {
                        foundNode = node;
                    }
                });
                for (let i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren()[i], depth + 1, id, curScope);
                }
            }
            expand(this.rootNode, 0, id, curScope);
            return foundNode;
        }
    }
    mackintosh.symbolTableTree = symbolTableTree;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=symbolTableTree.js.map