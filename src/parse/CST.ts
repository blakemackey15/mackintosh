module mackintosh {

    //Code reference: JavaScript tree demo: https://www.labouseur.com/projects/jsTreeDemo/treeDemo.js

    //Class to represent a node in the tree.
    export class CSTNode {
        private nodeName;
        private children : Array<CSTNode>;
        private parent : CSTNode;

        constructor(nodeName : string) {
            this.nodeName = nodeName;
            this.children = [];

        }

        public setNodeName(nodeName : string) {
            this.nodeName = nodeName;
        }

        public getNodeName() {
            return this.nodeName;
        }

        public getChildren() {
            return this.children;
        }

        public addChildren(child : CSTNode) {
            this.children.push(child)
        }

        public getParent() {
            return this.parent;
        }

        public setParent(parNode : CSTNode) {
            this.parent = parNode;
        }
    }
    
    //Class to represent CST.
    export class CST {
        private rootNode : CSTNode;
        private curNode : CSTNode;

        constructor() {
            this.rootNode = null;
        }

        public getRoot() {
            return this.rootNode;
        }

        public getCurNode() {
            return this.curNode;
        }

        //Kind represents if the node is a leaf or a branch node.
        public addNode(nodeName : string, kind : string) {

            //Create a node object. Has a name, child nodes, parent nodes, and if its a leaf or branch node.
            let node = new CSTNode(nodeName);

            //Check if theres a root node. If not, make the current node the root node.
            if(this.rootNode == null) {
                this.rootNode = node;
            }

            //The current node is a child node.
            else {
                node.setParent(this.curNode);
                this.curNode.addChildren(node);
            }

            //Check what kind of node this node is.
            if(kind == "branch") {
                this.curNode = node;
            }

        }

        public climbTree() {
            //Move up the tree to the parent node if it exists.
            if(this.curNode.getParent() !== null && this.curNode.getParent().getNodeName() !== undefined) {
                this.curNode = this.curNode.getParent();
            }
            
            else {
                _Functions.log("CST ERROR - Parent node does not exist.");
            }
        }

        public toString() {
            let treeString : string = "";

            //Handles the expansion of nodes using recursion.
            function expand(node : CSTNode, depth : number) {
                //Format to show the depth of the tree when displaying.
                for(let i = 0; i < depth; i++) {
                    treeString += "-";
                }

                //Check if the node is a leaf node. Then add the node and skip to new line.
                if(node.getChildren().length === 0) {
                    treeString +=  "[" + node.getNodeName() + "] \n";
                }

                //Get and display the children.
                else {
                    treeString += "<" + node.getNodeName() + "> \n"

                    for(let i = 0; i < node.getChildren().length; i++) {
                        expand(node.getChildren()[i], depth + 1);
                    }
                }
            }

            //Call and expand from the root node.
            expand(this.rootNode, 0);
            return treeString;
        }
    }
}