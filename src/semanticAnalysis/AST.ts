module mackintosh {
    //AST code based off CST which is based off JavaScript tree demo
    //https://www.labouseur.com/projects/jsTreeDemo/treeDemo.js


    //Class to represent a node in the AST.
    export class ASTNode {
        private nodeName : string;
        private children : Array<ASTNode>;
        private parent : ASTNode;

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

        public addChildren(child : ASTNode) {
            this.children.push(child)
        }

        public getParent() {
            return this.parent;
        }

        public setParent(parNode : ASTNode) {
            this.parent = parNode;
        }
    }

    //Class to represent the AST.
    export class AST {

    }
}