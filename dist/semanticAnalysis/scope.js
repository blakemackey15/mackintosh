var mackintosh;
(function (mackintosh) {
    //Represents the values in the hash map.
    class scope {
        constructor(value, type, scopePointer) {
            this.isUsed = false;
            this.value = value;
            this.scopePointer = scopePointer;
            this.type = type;
        }
        setIsUsed(isUsed) {
            this.isUsed = isUsed;
        }
        getIsUsed() {
            return this.isUsed;
        }
        getValue() {
            return this.value;
        }
        setValue(value) {
            this.value = value;
        }
        getType() {
            return this.type;
        }
        setType(type) {
            this.type = type;
        }
        getScopePointer() {
            return this.scopePointer;
        }
        setScopePointer(scopePointer) {
            this.scopePointer = scopePointer;
        }
    }
    mackintosh.scope = scope;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=scope.js.map