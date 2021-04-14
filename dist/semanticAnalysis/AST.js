var mackintosh;
(function (mackintosh) {
    //AST code based off CST which is based off JavaScript tree demo
    //https://www.labouseur.com/projects/jsTreeDemo/treeDemo.js
    //Class to represent a node in the AST.
    var ASTNode = /** @class */ (function () {
        function ASTNode(nodeName) {
            this.nodeName = nodeName;
            this.children = [];
        }
        ASTNode.prototype.setNodeName = function (nodeName) {
            this.nodeName = nodeName;
        };
        ASTNode.prototype.getNodeName = function () {
            return this.nodeName;
        };
        ASTNode.prototype.getChildren = function () {
            return this.children;
        };
        ASTNode.prototype.addChildren = function (child) {
            this.children.push(child);
        };
        ASTNode.prototype.getParent = function () {
            return this.parent;
        };
        ASTNode.prototype.setParent = function (parNode) {
            this.parent = parNode;
        };
        return ASTNode;
    }());
    mackintosh.ASTNode = ASTNode;
    //Class to represent the AST.
    var AST = /** @class */ (function () {
        function AST() {
        }
        return AST;
    }());
    mackintosh.AST = AST;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=AST.js.map