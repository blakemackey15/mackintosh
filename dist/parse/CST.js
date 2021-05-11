var mackintosh;
(function (mackintosh) {
    //Code reference: JavaScript tree demo: https://www.labouseur.com/projects/jsTreeDemo/treeDemo.js
    //Class to represent a node in the tree.
    class CSTNode {
        constructor(nodeName) {
            this.nodeName = nodeName;
            this.children = [];
        }
        setNodeName(nodeName) {
            this.nodeName = nodeName;
        }
        getNodeName() {
            return this.nodeName;
        }
        getChildren() {
            return this.children;
        }
        addChildren(child) {
            this.children.push(child);
        }
        getParent() {
            return this.parent;
        }
        setParent(parNode) {
            this.parent = parNode;
        }
    }
    mackintosh.CSTNode = CSTNode;
    //Class to represent CST.
    class CST {
        constructor() {
            this.rootNode = null;
        }
        getRoot() {
            return this.rootNode;
        }
        getCurNode() {
            return this.curNode;
        }
        //Kind represents if the node is a leaf or a branch node.
        addNode(nodeName, kind) {
            //Create a node object. Has a name, child nodes, parent nodes, and if its a leaf or branch node.
            let node = new CSTNode(nodeName);
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
        }
        climbTree() {
            //Move up the tree to the parent node if it exists.
            if (this.curNode.getParent() !== null && this.curNode.getParent().getNodeName() !== undefined) {
                this.curNode = this.curNode.getParent();
            }
            else {
                _Functions.log("CST ERROR - Parent node does not exist.");
            }
        }
        toString() {
            let treeString = "";
            //Handles the expansion of nodes using recursion.
            function expand(node, depth) {
                //Format to show the depth of the tree when displaying.
                for (let i = 0; i < depth; i++) {
                    treeString += "-";
                }
                //Check if the node is a leaf node. Then add the node and skip to new line.
                if (node.getChildren().length === 0) {
                    treeString += "[" + node.getNodeName() + "] \n";
                }
                //Get and display the children.
                else {
                    treeString += "<" + node.getNodeName() + "> \n";
                    for (let i = 0; i < node.getChildren().length; i++) {
                        expand(node.getChildren()[i], depth + 1);
                    }
                }
            }
            //Call and expand from the root node.
            expand(this.rootNode, 0);
            return treeString;
        }
    }
    mackintosh.CST = CST;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=CST.js.map