var mackintosh;
(function (mackintosh) {
    var CST = /** @class */ (function () {
        function CST() {
            this.rootNode = null;
        }
        CST.prototype.getRoot = function () {
            return this.rootNode;
        };
        CST.prototype.setRoot = function (node) {
            this.rootNode = node;
        };
        //Add nodes to the tree
        CST.prototype.addNode = function (nodeVal) {
            var newNode = new mackintosh.treeNode(nodeVal);
            //Check if the node is empty. If it is, make the new node the root node.
            if (this.rootNode == null) {
                this.setRoot(newNode);
                return true;
            }
            //If the root node is not empty, add it to the correct spot in the tree.
            else {
            }
        };
        //Recursive definition of depth first traversal - needed to get the valid tokens produced by the CST.
        CST.prototype.depthFirst = function () {
            var visit = new Array();
            var curNode = this.getRoot();
            function traverse(node) {
                //Array of visited node values.
                visit.push(node.getValue());
                //Check to see if node is right or left and then traverse the corresponding one.
                if (node.LeftNode) {
                    traverse(node.LeftNode);
                }
                if (node.RightNode) {
                    traverse(node.RightNode);
                }
            }
            traverse(curNode);
            return visit;
        };
        return CST;
    }());
    mackintosh.CST = CST;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=CST.js.map