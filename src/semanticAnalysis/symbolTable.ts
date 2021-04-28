module mackintosh {
    //Represents a node in the symbol table tree.
    export class symbolTableNode {
        private isUsed : boolean;
        private symbol : any;
        private type : any;
        private value : any;
        private parent : symbolTableNode;
        private children : Array<symbolTableNode>;
        private symbolTableEntry = new Map();

        //Takes in the symbol, value, and type of an entry in the symbol table.
        //The symbol is the key in the hash map entry.
        constructor(symbol : any, value : any, type : any) {
            this.isUsed = false;
            this.value = value;
            this.type = type;
            this.symbol = symbol;
        }

        public setValue(value : any) {
            this.value = value;
        }

        public getValue() : any {
            return this.value;
        }

        public setType(type : any) {
            this.type = type;
        }

        public getType() : any {
            return this.type;
        }

        public setSymbol(symbol : any) {
            this.symbol = symbol;
        }

        public getSymbol() : any {
            return this.symbol;
        }

        public setIsUsed(isUsed : boolean) {
            this.isUsed = isUsed;
        }

        public getIsUsed() : boolean {
            return this.isUsed;
        }

        public setParent(entry : symbolTableNode) {
            this.parent = entry;
        }

        public getParent() : symbolTableNode {
            return this.parent;
        }

        public addChild(child : symbolTableNode) {
            this.children.push(child);
        }

        public getChildren() {
            return this.children;
        }

        public createEntry(newSymbol : any) {
            //Check if the symbol already exists in the symbol table.
            if(this.symbol == this.symbolTableEntry.get(newSymbol)) {
                _Functions.log("SEMANTIC ANALYSIS ERROR - Identifier"  + newSymbol + 
                "has already been declared in current scope.");
                semErr++;
            }

            else {
                let values = new Array();
                //1st entry - type.
                //2nd entry - value.
                //3rd entry - used.
                values.push(this.getType());
                values.push(this.getValue());
                values.push(this.getIsUsed());
                this.symbolTableEntry.set(this.getSymbol(), values);
            }
        }

        public lookup(symbol : any) : any {
            if(this.symbolTableEntry.has(symbol)) {
                return this.symbolTableEntry.get(symbol);
            }

            else {
                _Functions.log("SEMANTIC ANALYSIS ERROR - Identifier " + symbol 
                + " was used before being initialized.");
            }
        }

        public getEntry() {
            return this.symbolTableEntry;
        }
    }

    export class symbolTable {
        private rootScope : symbolTableNode;
        private curScope : symbolTableNode;

        constructor() {
            this.rootScope = null;
        }

        public getRootScope() : symbolTableNode {
            return this.rootScope;
        }

        public getCurScope() : symbolTableNode {
            return this.curScope;
        }

        //Add a node to the symbol table tree.
        public addNode(symbol : any, value : any, type : any, kind : string) {
            let node = new symbolTableNode(symbol, value, type);

            //Check if this node is the root node.
            if(this.rootScope == null) {
                this.rootScope = null;
            }

            else {
                node.setParent(this.curScope);
                this.curScope.addChild(node);
            }

            //Update the current scope and add an entry to the symbol table.
            this.curScope = node;
            node.createEntry(symbol);

        }

        //Make the current scope the parent scope.
        public closeScope() {
            if(this.curScope.getParent() !== null) {
                this.curScope = this.curScope.getParent();
            }

            //This shouldn't happen in theory but just in case it does.
            else {
                _Functions.log("SYMBOL TREE ERROR - Parent node does not exist.");
            }
        }

        //Traverse the AST and add the symbols to an array.
        public traverseAST(ASTTree : CST) {
            //Create an array to store the symbols while traversing the tree.
            let symbols = new Array<string>();
            function expand(node : CSTNode, depth : number) {
                //Found a leaf node, add it to the symbols array.
                if(node.getChildren().length === 0) {
                    symbols.push(node.getNodeName());
                }

                //Traverse through tree and find named nodes.
                else {
                    for(let i = 0; i < node.getChildren().length; i++) {
                        expand(node.getChildren()[i], depth + 1);
                    }
                }
            }

            expand(ASTTree.getRoot(), 0);
            _Functions.log(symbols.toString());
            return symbols;
        }

    }
}