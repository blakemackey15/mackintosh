var mackintosh;
(function (mackintosh) {
    //Class to represent a node in the scope tree.
    var scopeTreeNode = /** @class */ (function () {
        function scopeTreeNode(scopeMap, parent) {
            if (scopeMap === void 0) { scopeMap = new Map(); }
            this.scopeMap = new Map();
            this.scopeMap = scopeMap;
            this.isUsed = false;
            this.children = [];
            this.parent = parent;
        }
        scopeTreeNode.prototype.addValue = function (key, value) {
            this.values.push(value);
            this.scopeMap.set(key, this.values);
        };
        scopeTreeNode.prototype.getValues = function () {
            return this.scopeMap.values();
        };
        scopeTreeNode.prototype.getParentScope = function () {
            return this.parent;
        };
        scopeTreeNode.prototype.setParentScope = function (parent) {
            this.parent = parent;
        };
        scopeTreeNode.prototype.addChildScope = function (scopeMap, parent) {
            if (scopeMap === void 0) { scopeMap = new Map(); }
            this.children.push(new scopeTreeNode(scopeMap, parent));
        };
        scopeTreeNode.prototype.getChild = function (scopePointer) {
            return this.children[scopePointer];
        };
        scopeTreeNode.prototype.setIsUsed = function (isUsed) {
            this.isUsed = isUsed;
        };
        scopeTreeNode.prototype.getIsUsed = function () {
            return this.isUsed;
        };
        return scopeTreeNode;
    }());
    mackintosh.scopeTreeNode = scopeTreeNode;
    //Class to represent the scope tree - tree of hash maps.
    var scopeTree = /** @class */ (function () {
        function scopeTree() {
            this.root = null;
        }
        scopeTree.prototype.getRoot = function () {
            return this.root;
        };
        scopeTree.prototype.getCurScope = function () {
            return this.curScope;
        };
        scopeTree.prototype.addNode = function (scopeMap, parent, kind) {
            if (scopeMap === void 0) { scopeMap = new Map(); }
            //Create new scope node based on the key, values, and parent.
            var newScope = new scopeTreeNode(scopeMap, parent);
            //Check if the root is null, and then set the node to be the root if not.
            if (this.root == null) {
                this.root = newScope;
            }
            //Child node - set parent and child scope.
            else {
                newScope.setParentScope(parent);
                this.curScope.addChildScope(scopeMap, newScope);
            }
            if (kind == "branch") {
                this.curScope = newScope;
            }
        };
        //Move up the scope tree to the parent scope.
        scopeTree.prototype.closeScope = function () {
            if (this.curScope.getParentScope() !== null) {
                this.curScope = this.curScope.getParentScope();
            }
            else {
                _Functions.log("SYMBOL TABLE ERROR - Parent Scope does not exist.");
            }
        };
        //Print out symbol table tree.
        scopeTree.prototype.toString = function () {
        };
        return scopeTree;
    }());
    mackintosh.scopeTree = scopeTree;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=scopeTree.js.map