var mackintosh;
(function (mackintosh) {
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
            return "T" + this.curTemp++;
        }
        getByTemp(tempId) {
            for (let i = 0; i < this.tableEntries.length; i++) {
                if (this.tableEntries[i].getTemp() == tempId) {
                    return this.tableEntries[i];
                }
            }
            return null;
        }
        backpatch(executableImage) {
            for (let i = 0; i < this.tableEntries.length; i++) {
                if (tempIdMatch.test(executableImage[i])) {
                    let entry = this.getByTemp(executableImage[i]);
                    executableImage.addCode(mackintosh.codeGenerator.leftPad(entry.getDistance().toString(16), 2), i);
                }
            }
        }
    }
    mackintosh.jumpTable = jumpTable;
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