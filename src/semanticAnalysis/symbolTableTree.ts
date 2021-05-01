module mackintosh {
    //Represents a node in the symbol table.
    export class symbolTableNode {
        private hashmap = new Map();
        private children : Array<symbolTableNode>;
        private parent : symbolTableNode;

        constructor(map = new Map()) {
            this.hashmap = map;
            this.children = [];
        }

        public setMap(map = new Map()) {
            this.hashmap = map;
        }

        public getMap() {
            return this.hashmap;
        }

        public setParentScope(parent) {
            this.parent = parent;
        }

        public getParentScope() : symbolTableNode {
            return this.parent;
        }

        public getChildren() : Array<symbolTableNode> {
            return this.children;
        }

        public addChild(child : symbolTableNode) {
            this.children.push(child);
        }

    }

    //Represent the symbol table tree.
    export class symbolTableTree {
        private rootNode : symbolTableNode;
        private curNode : symbolTableNode;

        constructor() {
            this.rootNode = null;
        }

        public getRoot() {
            return this.rootNode;
        }

        public getCurNode() {
            return this.curNode;
        }

        public addNode(map = new Map()) {
            let node = new symbolTableNode(map);

            if(this.rootNode == null) {
                this.rootNode = node;
            }

            else {
                node.setParentScope(this.curNode);
                this.curNode.addChild(node);
            }
        }

        
    }
}