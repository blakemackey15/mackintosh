var mackintosh;
(function (mackintosh) {
    //Represents the static table and implements the codeGenTable interface.
    class staticTable {
        constructor() {
            this.tableEntries = new Array();
            this.curTemp = 0;
            this.curOffset = 0;
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
        //Search for the entry by scope and var.
        getByVarAndScope(varId, searchScope) {
            /* while (searchScope == undefined || searchScope == null) {
                searchScope = symbolTable.getNode(curScope - 1);
            } */
            for (let i = this.tableEntries.length - 1; i >= 0; i--) {
                //Check if both the scope and var are in the table.
                if (this.tableEntries[i].getId() == varId) {
                    let expectedScope = this.tableEntries[i].getCurScope().getScopePointer();
                    let actualScope = searchScope.lookup(varId).getScopePointer();
                    if (expectedScope == actualScope) {
                        return this.tableEntries[i];
                    }
                    else {
                        let parent = searchScope.getParentScope();
                        while (parent != null) {
                            //Reassign the expected scope pointer to the parent's scope pointer.
                            expectedScope = parent.getMap().get(varId).getScopePointer();
                            if (expectedScope == actualScope) {
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
        getByTemp(tempId) {
            for (let i = 0; i < this.tableEntries.length; i++) {
                //Search for the entry that matches the temp id.
                if (this.tableEntries[i].getTemp() == tempId) {
                    return this.tableEntries[i];
                }
            }
            //If we get here, that means there was no match.
            return null;
        }
        backpatch(executableImage) {
            //Go back and replace all of the temp data points with the correct data.
            for (let i = 0; i < executableImage.getIMAGE_SIZE(); i++) {
                let entry = executableImage.getEntries()[i];
                //Creates an array of matched ids.
                let matched = entry.match(tempIdMatch);
                if (matched) {
                    let foundEntry = this.getByTemp(matched[1]);
                    executableImage.addCode(mackintosh.codeGenerator.leftPad((foundEntry.getOffset() + executableImage.getStackPointer() + 1).toString(16), 2), i);
                    executableImage.addCode('00', i + 1);
                }
            }
        }
    }
    mackintosh.staticTable = staticTable;
    //Represents an entry in the static table.
    class staticTableEntry {
        constructor(temp, id, offset, curScope) {
            this.temp = temp;
            this.id = id;
            this.offset = offset;
            this.curScope = curScope;
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