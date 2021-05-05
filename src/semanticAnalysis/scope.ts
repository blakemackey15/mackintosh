module mackintosh {
        //Represents the values in the hash map.
        export class scope {
            private isUsed : boolean
            private value : any;
            private type : any;
            private scopePointer : number;
    
            constructor(value : any, type : any, scopePointer : number) {
                this.isUsed = false;
                this.value = value;
                this.scopePointer = scopePointer;
                this.type = type;
            }
    
            public setIsUsed(isUsed : boolean) {
                this.isUsed = isUsed;
            }
    
            public getIsUsed() : boolean {
                return this.isUsed;
            }
    
            public getValue() : any {
                return this.value;
            }

            public setValue(value : any) {
                this.value = value;
            }
    
            public getType() : any {
                return this.type;
            }

            public setType(type : any) {
                this.type = type;
            }

            public getScopePointer() {
                return this.scopePointer;
            }

            public setScopePointer(scopePointer : number) {
                this.scopePointer = scopePointer; 
            }
        }
}
