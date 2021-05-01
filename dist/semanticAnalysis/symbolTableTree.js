var mackintosh;
(function (mackintosh) {
    //Represents a node in the symbol table.
    var symbolTableNode = /** @class */ (function () {
        function symbolTableNode(map) {
            if (map === void 0) { map = new Map(); }
            this.hashmap = new Map();
            this.hashmap = map;
            this.children = [];
        }
        symbolTableNode.prototype.setMap = function (map) {
            if (map === void 0) { map = new Map(); }
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
            if (map === void 0) { map = new Map(); }
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