var mackintosh;
(function (mackintosh) {
    class jumpTable {
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