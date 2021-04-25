module mackintosh {
    //Class to represent a node in the scope tree.
    export class scopeTreeNode {
        private values : Array<string>;
        private scopeMap = new Map();
        private isUsed : boolean;

        constructor(key : string, values : Array<string>) {
            this.values = values;
            this.scopeMap.set(key, values);
            this.isUsed = false;     
        }

        public addValue(key : string, value : string) {
            this.values.push(value);
            this.scopeMap.set(key, this.values);
        }

        public getValues() {
            return this.scopeMap.values();
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
        private children : Array<scopeTreeNode>;
        private parent : scopeTreeNode;

        constructor(parent : scopeTreeNode) {
            this.children = [];
            this.parent = parent;
        }

        public getParentScope() : scopeTreeNode {
            return this.parent;
        }

        public createChildScope(values : Array<string>, key : string) {
            this.children.push(new scopeTreeNode(key, values));
        }

        public getChild(scopePointer : number) : scopeTreeNode {
            return this.children[scopePointer];
        }

        //Print out symbol table tree.
        public toString() {

        }
    }
}