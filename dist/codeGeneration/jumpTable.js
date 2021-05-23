var mackintosh;
(function (mackintosh) {
    //Represents the jump table.
    class jumpTable {
        constructor() {
            this.tableEntries = new Array();
            this.curTemp = 0;
        }
        getCurTemp() {
            return this.curTemp;
        }
        addEntry(newEntry) {
            this.tableEntries.push(newEntry);
            return newEntry;
        }
        getNextTemp() {
            return "J" + this.curTemp++;
        }
        //Get a value by it's temp id.
        getByTemp(tempId) {
            for (let i = 0; i < this.tableEntries.length; i++) {
                if (this.tableEntries[i].getTemp() == tempId) {
                    return this.tableEntries[i];
                }
            }
            //If we get here, its not in the table.
            return null;
        }
        //Go back and replace temps with the correct code.
        backpatch(executableImage) {
            for (let i = 0; i < executableImage.getIMAGE_SIZE(); i++) {
                let entry = executableImage.getEntries()[i];
                let matched = entry.match(jumpIdMatch);
                if (matched) {
                    let foundEntry = this.getByTemp(matched[1]);
                    executableImage.addCode(mackintosh.codeGenerator.leftPad(foundEntry.getDistance().toString(16), 2), i);
                }
            }
        }
    }
    mackintosh.jumpTable = jumpTable;
    //Represents a single entry in the jump table.
    class jumpTableEntry {
        constructor(temp, distance) {
            this.temp = temp;
            this.distance = distance;
        }
        getTemp() {
            return this.temp;
        }
        setTemp(temp) {
            this.temp = temp;
        }
        getDistance() {
            return this.distance;
        }
        setDistance(distance) {
            this.distance = distance;
        }
    }
    mackintosh.jumpTableEntry = jumpTableEntry;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=jumpTable.js.map