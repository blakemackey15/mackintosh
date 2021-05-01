module mackintosh {
        //Represents the values in the hash map.
        export class scope {
            private isUsed : boolean
            private value : any;
            private type : any;
    
            constructor(value : any, type : any) {
                this.isUsed = false;
                this.value = value;
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
    
            public getType() : any {
                return this.type;
            }
        }
}
