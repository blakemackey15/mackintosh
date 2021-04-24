module mackintosh {
    //Class to represent a node in the scope tree.
    export class scopeTreeNode {
        private parent : scopeTreeNode;
        private children : Array<scopeTreeNode>;
        private scopeMap = new Map();

        constructor(key : string, values : Array<string>) {
            this.children = [];
            this.scopeMap.set(key, values);        
        }
    }

    //Class to represent the scope tree - tree of hash maps.
    export class scopeTree {
        
    }
}