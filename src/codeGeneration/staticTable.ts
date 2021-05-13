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
            for(let i = 0; i < this.tableEntries.length; i++) {
                if(this.tempIdMatch.test(executableImage[i])) {

                }
            }
        }

    }

    export class staticTableEntry {
        private temp : string;
        private id : string;
        private offset : number;
        private curScope : number;

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

        public setCurScope(curScope : number) {
            this.curScope = curScope;
        }
    }
}