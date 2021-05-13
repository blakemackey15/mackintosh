var mackintosh;
(function (mackintosh) {
    //Represents the static table and implements the codeGenTable interface.
    class staticTable {
        constructor() {
            this.tableEntries = new Array();
            this.curTemp = 0;
            this.curOffset = 0;
            this.tempIdMatch = /^(T[0-9])/;
        }
        getCurTemp() {
            return this.curTemp;
        }
        setCurTemp(curTemp) {
            this.curTemp = curTemp;
        }
        getCurOffset() {
            return this.curOffset;
        }
        setCurOffset(curOffset) {
            this.curOffset = curOffset;
        }
        //Add an entry to the static table.
        addEntry(entry) {
            this.tableEntries.push(entry);
            return entry;
        }
        getNextTemp() {
            return "T" + this.curTemp++;
        }
        getNextOffset() {
            return this.curOffset++;
        }
        getByTemp(tempId) {
            for (let i = 0; i < this.tableEntries.length; i++) {
                //Search for the entry that matches the temp id.
                if (this.tableEntries[i].getTemp() === tempId) {
                    return this.tableEntries[i];
                }
            }
            //If we get here, that means there was no match.
            return null;
        }
        backpatch(executableImage) {
            for (let i = 0; i < this.tableEntries.length; i++) {
                if (this.tempIdMatch.test(executableImage[i])) {
                }
            }
        }
    }
    mackintosh.staticTable = staticTable;
    class staticTableEntry {
        constructor() {
        }
        getTemp() {
            return this.temp;
        }
        setTemp(temp) {
            this.temp = temp;
        }
        getId() {
            return this.id;
        }
        setId(id) {
            this.id = id;
        }
        getOffset() {
            return this.offset;
        }
        setOffset(offset) {
            this.offset = offset;
        }
        getCurScope() {
            return this.curScope;
        }
        setCurScope(curScope) {
            this.curScope = curScope;
        }
    }
    mackintosh.staticTableEntry = staticTableEntry;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=staticTable.js.map