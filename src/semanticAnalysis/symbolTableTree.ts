module mackintosh {
    //Represents a node in the symbol table.
    export class symbolTableNode {
        private hashmap : Map<any, scope>;
        private children : Array<symbolTableNode>;
        private parent : symbolTableNode;

        constructor(map : Map<any, scope>) {
            this.hashmap = map;
            this.children = [];
            this.parent = null;
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

        //Get the list of unused identifiers.
        public getUnusedIds() : Array<any> {
            let unusedIds = [];
            
            this.hashmap.forEach((value : scope, key : any) => {
                if(!value.getIsUsed()) {
                    unusedIds.push(key as string);
                }
            });

            //Return the list of unused ids.
            return unusedIds;
        }

        public assignment(symbol : any, value : any) {
            let newScope = this.lookup(symbol);
            let scope = newScope.getScopePointer();
            let symbolTableNode = symbolTable.getNode(scope);

            if(newScope == null) {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Id " + symbol + " has not been identified in symbol table.");
            }

            else {
                let type = newScope.getType();
                newScope.setValue(value);
                newScope.setIsUsed(true);
                newScope.setType(type);
                symbolTableNode.getMap().set(symbol, newScope);
            }
        }

        public lookup(symbol : any) : scope {
            if(this.hashmap.has(symbol)) {
                return this.hashmap.get(symbol);
            }

            //If it wasn't found and the parent isn't null check and see if its there.
            else if(this.parent !== null) {
                return this.parent.lookup(symbol);
            }

            return null;
        }
    }

    //Represent the symbol table tree.
    export class symbolTableTree {
        private rootNode : symbolTableNode;
        private curNode : symbolTableNode;

        constructor() {
            this.rootNode = null;
        }

        public getRoot() : symbolTableNode {
            return this.rootNode;
        }

        public getCurNode() : symbolTableNode {
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

            this.curNode = node;
        }

        public closeScope() {
            //Move up the tree to parent node.
            if(this.curNode.getParentScope() !== null && this.curNode.getParentScope() !== undefined) {
                this.curNode = this.curNode.getParentScope();
            }

            else if(this.curNode == this.rootNode) {
                return;
            }

            else {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Parent scope does not exist.");
            }
        }

        public toString() : string {
            let tableString = "";

            function expand(node : symbolTableNode, depth : number) {
                //Iterate through each key value pair and add them to the tree.
                let map = node.getMap()
                map.forEach((value : scope, key : any) => {
                    tableString += key + "            " + value.getType() as string + 
                    "            " + value.getScopePointer() as unknown as string + "\n";
                });

                for(let i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren()[i], depth + 1);
                }
            }
            expand(this.rootNode, 0);
            return tableString;
        }

        public getNode(curScope : number) : symbolTableNode {
            let foundNode : symbolTableNode
            function expand(node : symbolTableNode, depth : number, curScope : number)  {
                let map = node.getMap();
                map.forEach((value : scope, key : any) => {
                    if(curScope == value.getScopePointer() as number) {
                        foundNode = node;
                    }
                });

                for(let i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren()[i], depth + 1, curScope);
                }
            }

            expand(this.rootNode, 0, curScope);
            return foundNode;
        }

    }
}