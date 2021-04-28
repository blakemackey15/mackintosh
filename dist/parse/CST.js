var mackintosh;
(function (mackintosh) {
    //Code reference: JavaScript tree demo: https://www.labouseur.com/projects/jsTreeDemo/treeDemo.js
    //Class to represent a node in the tree.
    var CSTNode = /** @class */ (function () {
        function CSTNode(nodeName) {
            this.nodeName = nodeName;
            this.children = [];
        }
        CSTNode.prototype.setNodeName = function (nodeName) {
            this.nodeName = nodeName;
        };
        CSTNode.prototype.getNodeName = function () {
            return this.nodeName;
        };
        CSTNode.prototype.getChildren = function () {
            return this.children;
        };
        CSTNode.prototype.addChildren = function (child) {
            this.children.push(child);
        };
        CSTNode.prototype.getParent = function () {
            return this.parent;
        };
        CSTNode.prototype.setParent = function (parNode) {
            this.parent = parNode;
        };
        return CSTNode;
    }());
    mackintosh.CSTNode = CSTNode;
    //Class to represent CST.
    var CST = /** @class */ (function () {
        function CST() {
            this.rootNode = null;
        }
        CST.prototype.getRoot = function () {
            return this.rootNode;
        };
        CST.prototype.getCurNode = function () {
            return this.curNode;
        };
        //Kind represents if the node is a leaf or a branch node.
        CST.prototype.addNode = function (nodeName, kind) {
            //Create a node object. Has a name, child nodes, parent nodes, and if its a leaf or branch node.
            var node = new CSTNode(nodeName);
            //Check if theres a root node. If not, make the current node the root node.
            if (this.rootNode == null) {
                this.rootNode = node;
            }
            //The current node is a child node.
            else {
                node.setParent(this.curNode);
                this.curNode.addChildren(node);
            }
            //Check what kind of node this node is. Branch nodes are the grammar names (block, statement, etc.) and leaf nodes
            //are the tokens.
            if (kind == "branch") {
                this.curNode = node;
            }
        };
        CST.prototype.climbTree = function () {
            //Move up the tree to the parent node if it exists.
            if (this.curNode.getParent() !== null && this.curNode.getParent().getNodeName() !== undefined) {
                this.curNode = this.curNode.getParent();
            }
            else {
                _Functions.log("CST ERROR - Parent node does not exist.");
            }
        };
        //Traverses AST and builds table.
        CST.prototype.traverseAST = function (values, key) {
            function expand(node, depth, values, key) {
                //Check if it is an AST leaf node. Depending on the type, it'll be added to the appropriate area in the map.
                if (node.getChildren().length === 0) {
                    var name_1 = node.getNodeName();
                    //Add types.
                    if (name_1 == "int") {
                        //Set the type to be int.
                        values.push(name_1);
                    }
                    else if (name_1 == "string") {
                        //Set type to string.
                        values.push(name_1);
                    }
                    else if (name_1 == "boolean") {
                        //Set type to boolean.
                        values.push(name_1);
                    }
                    //Set this variable to be the key.
                    else if (characters.test(name_1)) {
                        key = name_1;
                    }
                }
                //Traverse through children.
                else {
                    for (var i = 0; i < node.getChildren().length; i++) {
                        expand(node.getChildren()[i], depth + 1, values, key);
                    }
                }
            }
            expand(this.rootNode, 0, values, key);
            var tempMap = new Map();
            tempMap.set(key, values);
            return tempMap;
        };
        CST.prototype.toString = function () {
            var treeString = "";
            //Handles the expansion of nodes using recursion.
            function expand(node, depth) {
                //Format to show the depth of the tree when displaying.
                for (var i = 0; i < depth; i++) {
                    treeString += "-";
                }
                //Check if the node is a leaf node. Then add the node and skip to new line.
                if (node.getChildren().length === 0) {
                    treeString += "[" + node.getNodeName() + "] \n";
                }
                //Get and display the children.
                else {
                    treeString += "<" + node.getNodeName() + "> \n";
                    for (var i = 0; i < node.getChildren().length; i++) {
                        expand(node.getChildren()[i], depth + 1);
                    }
                }
            }
            //Call and expand from the root node.
            expand(this.rootNode, 0);
            return treeString;
        };
        return CST;
    }());
    mackintosh.CST = CST;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=CST.js.map