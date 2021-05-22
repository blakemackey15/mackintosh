module mackintosh {
    //Represents the static table and implements the codeGenTable interface.
    export class staticTable implements codeGenTable<staticTableEntry> {
        public tableEntries : Array<staticTableEntry>;
        public curTemp : number;
        public curOffset : number;

        constructor() {
            this.tableEntries = new Array<staticTableEntry>();
            this.curTemp = 0;
            this.curOffset = 0;
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
        public getByVarAndScope(varId : string, searchScope : symbolTableNode) : staticTableEntry {
            /* while (searchScope == undefined || searchScope == null) {
                searchScope = symbolTable.getNode(curScope - 1);
            } */

            for(let i = this.tableEntries.length - 1; i >= 0; i--) {
                //Check if both the scope and var are in the table.
                if(this.tableEntries[i].getId() == varId) {
                    let expectedScope = this.tableEntries[i].getCurScope().getScopePointer();
                    let actualScope = searchScope.lookup(varId).getScopePointer();

                    if( expectedScope == actualScope) {
                        return this.tableEntries[i];
                    }

                    else {
                        let parent = searchScope.getParentScope();
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

        //Get by temp id.
        public getByTemp(tempId : string) : staticTableEntry {
            for(let i = 0; i < this.tableEntries.length; i++) {
                //Search for the entry that matches the temp id.
                if(this.tableEntries[i].getTemp() == tempId) {
                    return this.tableEntries[i];
                }
            }

            //If we get here, that means there was no match.
            return null;
        }

        public backpatch(executableImage : executableImage) {
            //Go back and replace all of the temp data points with the correct data.
            for(let i = 0; i < executableImage.getIMAGE_SIZE(); i++) {
                let entry = executableImage.getEntries()[i];
                //Creates an array of matched ids.
                let matched = entry.match(tempIdMatch);
                if(matched) {
                    let foundEntry = this.getByTemp(matched[1]);
                    executableImage.addCode(codeGenerator.leftPad(
                        (foundEntry.getOffset() + executableImage.getStackPointer() + 1).toString(16), 2), i);
                    executableImage.addCode('00', i + 1);
                }
            }
        }

    }

    //Represents an entry in the static table.
    export class staticTableEntry {
        private temp : string;
        private id : string;
        private offset : number;
        private curScope : scope;

        constructor(temp : string, id : string, offset : number, curScope : scope) {
            this.temp = temp;
            this.id = id;
            this.offset = offset;
            this.curScope = curScope;
        }

        public getTemp() : string {
            return this.temp;
        }

        public setTemp(temp : string) {
            this.temp = temp;
        }

        public getId() : string {
            return this.id;
        }

        public setId(id : string) {
            this.id = id;
        }

        public getOffset() : number {
            return this.offset;
        }

        public setOffset(offset : number) {
            this.offset = offset;
        }

        public getCurScope() : scope {
            return this.curScope;
        }

        public setCurScope(curScope : scope) {
            this.curScope = curScope;
        }
    }
}