var mackintosh;
(function (mackintosh) {
    //Class to represent a node in the scope tree.
    var scopeTreeNode = /** @class */ (function () {
        function scopeTreeNode(key, values) {
            this.scopeMap = new Map();
            this.values = values;
            this.scopeMap.set(key, values);
            this.isUsed = false;
        }
        scopeTreeNode.prototype.addValue = function (key, value) {
            this.values.push(value);
            this.scopeMap.set(key, this.values);
        };
        scopeTreeNode.prototype.getValues = function () {
            return this.scopeMap.values();
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
        function scopeTree(parent) {
            this.children = [];
            this.parent = parent;
        }
        scopeTree.prototype.getParentScope = function () {
            return this.parent;
        };
        scopeTree.prototype.createChildScope = function (values, key) {
            this.children.push(new scopeTreeNode(key, values));
        };
        scopeTree.prototype.getChild = function (scopePointer) {
            return this.children[scopePointer];
        };
        //Print out symbol table tree.
        scopeTree.prototype.toString = function () {
        };
        return scopeTree;
    }());
    mackintosh.scopeTree = scopeTree;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=scopeTree.js.map