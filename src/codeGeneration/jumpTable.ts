module mackintosh {
    //Represents the jump table.
    export class jumpTable implements codeGenTable<jumpTableEntry>{
        public tableEntries : Array<jumpTableEntry>;
        public curTemp : number;

        constructor() {
            this.tableEntries = new Array<jumpTableEntry>();
            this.curTemp = 0;
        }

        public getCurTemp() : number {
            return this.curTemp;
        }

        public addEntry(newEntry : jumpTableEntry) : jumpTableEntry {
            this.tableEntries.push(newEntry);
            return newEntry;
        }

        public getNextTemp() : string {
            return "J" + this.curTemp++;
        }

        //Get a value by it's temp id.
        public getByTemp(tempId : string) : jumpTableEntry {
            for(let i = 0; i < this.tableEntries.length; i++) {
                if(this.tableEntries[i].getTemp() == tempId) {
                    return this.tableEntries[i];
                }
            }

            //If we get here, its not in the table.
            return null;
        }

        //Go back and replace temps with the correct code.
        public backpatch(executableImage : executableImage) {
            for(let i = 0; i < executableImage.getIMAGE_SIZE(); i++) {
                let entry = executableImage.getEntries()[i];
                let matched = entry.match(jumpIdMatch);
                if(matched) {
                    let foundEntry = this.getByTemp(matched[1]);
                    executableImage.addCode(codeGenerator.leftPad(foundEntry.getDistance().toString(16), 2), i);
                }
            }
        }


    }

    //Represents a single entry in the jump table.
    export class jumpTableEntry {
        private temp : string;
        private distance : number;

        constructor(temp : string, distance : number) {
            this.temp = temp;
            this.distance = distance;
        }

        public getTemp() : string {
            return this.temp;
        }

        public setTemp(temp : string) {
            this.temp = temp;
        }

        public getDistance() : number {
            return this.distance;
        }

        public setDistance(distance : number) {
            this.distance = distance;
        }
    }
} 