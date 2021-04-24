var mackintosh;
(function (mackintosh) {
    //Class to represent a node in the scope tree.
    var scopeTreeNode = /** @class */ (function () {
        function scopeTreeNode(key, values) {
            this.scopeMap = new Map();
            this.children = [];
            this.scopeMap.set(key, values);
        }
        return scopeTreeNode;
    }());
    mackintosh.scopeTreeNode = scopeTreeNode;
    //Class to represent the scope tree - tree of hash maps.
    var scopeTree = /** @class */ (function () {
        function scopeTree() {
        }
        return scopeTree;
    }());
    mackintosh.scopeTree = scopeTree;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=scopeTree.js.map