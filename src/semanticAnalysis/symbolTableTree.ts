module mackintosh {
    //Represents a node in the symbol table.
    export class symbolTableNode {
        private hashmap : Map<any, scope>;
        private children : Array<symbolTableNode>;
        private parent : symbolTableNode;

        constructor(map : Map<any, scope>) {
            this.hashmap = map;
            this.children = [];
        }

        public setMap(map : Map<any, scope>) {
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

        public addSymbol(symbol : any, value : scope) {
            if(this.hashmap.has(symbol)) {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Id has already been declared in this scope.");
            }

            else {
                this.hashmap.set(symbol, value);
            }
        }

        //Check if the scope has unused identifiers.
        public hasUnusedIds() : boolean {
            for(let i = 0; i < this.hashmap.size; i++) {
                if(!this.hashmap.values()[i].getIsUsed()) {
                    return true;
                }
            }

            return false;
        }
        //Get the list of unused identifiers.
        public getUnusedIds() : Array<any> {
            let unusedIds = [];
            for(let i = 0; i < this.hashmap.size; i++) {
                //Check if the symbol has not been used.
                if(!this.hashmap.values()[i].getIsUsed()) {
                    unusedIds.push(this.hashmap.keys[i]);
                }
            }

            //Return the list of unused ids.
            return unusedIds;
        }

        public assignment(symbol : any, value : any) {
            let newScope = this.lookup(symbol);

            if(newScope == null) {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Id " + symbol + " has not been identified in symbol table.");
            }

            else {
                let type = newScope.getType();
                newScope.setValue(value);
                this.hashmap.set(symbol, newScope);
            }
        }

        public lookup(symbol : any) {
            if(this.hashmap.has(symbol)) {
                return this.hashmap.get(symbol);
            }

            //If it wasn't found and the parent isn't null check and see if its there.
            else if(this.parent != null) {
                this.parent.lookup(symbol);
            }

            return null;
        }

        public checkType(value : any, type : any) : boolean {
            if(typeof value == type) {
                return true;
            }

            else {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Type mismatch, expected " 
                + typeof type + "but got " + typeof value + "instead.");
            }
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

        public addNode(map : Map<any, scope>) {
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