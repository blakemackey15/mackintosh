//Class that represents a singular node in a tree.
var mackintosh;
(function (mackintosh) {
    var treeNode = /** @class */ (function () {
        //Initialize a tree node.
        function treeNode(nodeVal) {
            this.value = nodeVal;
            this.leftNode = null;
            this.rightNode = null;
        }
        //Get and set methods for node attributes.
        treeNode.prototype.getValue = function () {
            return this.value;
        };
        treeNode.prototype.setValue = function (num) {
            this.value = num;
        };
        Object.defineProperty(treeNode.prototype, "RightNode", {
            get: function () {
                return this.rightNode;
            },
            set: function (node) {
                this.rightNode = node;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(treeNode.prototype, "LeftNode", {
            get: function () {
                return this.leftNode;
            },
            set: function (node) {
                this.leftNode = node;
            },
            enumerable: false,
            configurable: true
        });
        return treeNode;
    }());
    mackintosh.treeNode = treeNode;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=treeNode.js.map