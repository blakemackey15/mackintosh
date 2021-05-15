module mackintosh {
    //Represents the static table and implements the codeGenTable interface.
    export class staticTable implements codeGenTable<staticTableEntry> {
        public tableEntries : Array<staticTableEntry>;
        public curTemp : number;
        public tempIdMatch : RegExp;
        public curOffset : number;

        constructor() {
            this.tableEntries = new Array<staticTableEntry>();
            this.curTemp = 0;
            this.curOffset = 0;
            this.tempIdMatch = /^(T[0-9])/;
        }

        public getCurTemp() : number {
            return this.curTemp;
        }

        public setCurTemp(curTemp : number) {
            this.curTemp = curTemp;
        }

        public getCurOffset() : number {
            return this.curOffset;
        }

        public setCurOffset(curOffset : number) {
            this.curOffset = curOffset;
        }

        //Add an entry to the static table.
        public addEntry(entry : staticTableEntry) {
            this.tableEntries.push(entry);
            return entry;
        }

        public getNextTemp() : string {
            return "T" + this.curTemp++;
        }

        public getNextOffset() : number {
            return this.curOffset++;
        }

        //Search for the entry by scope and var.
        public getByVarAndScope(varId : string, curScope : symbolTableNode) : staticTableEntry {
            for(let i = this.tableEntries.length - 1; i >= 0; i--) {
                //Check if both the scope and var are in the table.
                if(this.tableEntries[i].getId() == varId) {
                    let expectedScope = this.tableEntries[i].getCurScope().getScopePointer();
                    let actualScope = curScope.getMap().get(varId).getScopePointer();

                    if( expectedScope == actualScope) {
                        return this.tableEntries[i];
                    }

                    else {
                        let parent = curScope.getParentScope();
                        while(parent != null) {
                            //Reassign the expected scope pointer to the parent's scope pointer.
                            expectedScope = parent.getMap().get(varId).getScopePointer();

                            if(expectedScope == actualScope) {
                                return this.tableEntries[i];
                            }

                            //Go up to the next parent.
                            parent = parent.getParentScope();
                        }
                    }
                }
            }

            //If we get here, then its not there.
            return null;
        }

        public getByTemp(tempId : string) : staticTableEntry {
            for(let i = 0; i < this.tableEntries.length; i++) {
                //Search for the entry that matches the temp id.
                if(this.tableEntries[i].getTemp() === tempId) {
                    return this.tableEntries[i];
                }
            }

            //If we get here, that means there was no match.
            return null;
        }

        public backpatch(executableImage : executableImage) {
            //Go back and replace all of the temp data points with the correct data.
            for(let i = 0; i < this.tableEntries.length; i++) {
                
                if(this.tempIdMatch.test(executableImage[i])) {
                    let entry = this.getByTemp(executableImage[i]);
                    executableImage.addCode(codeGenerator.leftPad(
                        (entry.getOffset() + executableImage.getStackPointer() + 1).toString(16), 2), i);
                    executableImage.addCode('00', i + 1);
                }
            }
        }

    }

    export class staticTableEntry {
        private temp : string;
        private id : string;
        private offset : number;
        private curScope : scope;

        constructor() {

        }

        public getTemp() {
            return this.temp;
        }

        public setTemp(temp : string) {
            this.temp = temp;
        }

        public getId() {
            return this.id;
        }

        public setId(id : string) {
            this.id = id;
        }

        public getOffset() {
            return this.offset;
        }

        public setOffset(offset : number) {
            this.offset = offset;
        }

        public getCurScope() {
            return this.curScope;
        }

        public setCurScope(curScope : scope) {
            this.curScope = curScope;
        }
    }
}