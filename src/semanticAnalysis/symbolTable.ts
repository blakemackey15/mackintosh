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

        }

    }
}