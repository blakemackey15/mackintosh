module mackintosh {
    //Class to represent a node in the scope tree.
    export class scopeTreeNode {
        private values : Array<string>;
        private scopeMap = new Map();
        private children : Array<scopeTreeNode>;
        private parent : scopeTreeNode;
        private isUsed : boolean;

        constructor(key : string, values : Array<string>, parent : scopeTreeNode) {
            this.values = values;
            this.scopeMap.set(key, values);
            this.isUsed = false;   
            this.children = [];
            this.parent = parent;  
        }

        public addValue(key : string, value : string) {
            this.values.push(value);
            this.scopeMap.set(key, this.values);
        }

        public getValues() {
            return this.scopeMap.values();
        }

        public getParentScope() : scopeTreeNode {
            return this.parent;
        }

        public setParentScope(parent : scopeTreeNode) {
            this.parent = parent;
        }

        public addChildScope(key : string, values : Array<string>, parent : scopeTreeNode) {
            this.children.push(new scopeTreeNode(key, values, parent));
        }

        public getChild(scopePointer : number) : scopeTreeNode {
            return this.children[scopePointer];
        }

        public setIsUsed(isUsed : boolean) {
            this.isUsed = isUsed;
        }

        public getIsUsed() : boolean {
            return this.isUsed;
        }
    }

    //Class to represent the scope tree - tree of hash maps.
    export class scopeTree {
        private root : scopeTreeNode;
        private curScope : scopeTreeNode;

        constructor() {
            this.root = null;
        }

        public getRoot() {
            return this.root;
        }

        public getCurScope() {
            return this.curScope;
        }

        public addNode(key : string, values : Array<string>, parent : scopeTreeNode, kind : string) {
            //Create new scope node based on the key, values, and parent.
            let newScope = new scopeTreeNode(key, values, parent);
            //Check if the root is null, and then set the node to be the root if not.
            if(this.root == null) {
                this.root = newScope;
            }

            //Child node - set parent and child scope.
            else {
                newScope.setParentScope(parent);
                this.curScope.addChildScope(key, values, newScope);
            }

            if(kind == "branch") {
                this.curScope = newScope;
            }
        }

        //Move up the scope tree to the parent scope.
        public closeScope() {
            if(this.curScope.getParentScope() !== null) {
                this.curScope = this.curScope.getParentScope();
            }

            else {
                _Functions.log("SYMBOL TABLE ERROR - Parent Scope does not exist.");
            }
        }

        //Print out symbol table tree.
        public toString() {

        }
    }
}