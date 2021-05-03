var mackintosh;
(function (mackintosh) {
    //Represents the values in the hash map.
    var scope = /** @class */ (function () {
        function scope(value, type, scopePointer) {
            this.isUsed = false;
            this.value = value;
            this.scopePointer = scopePointer;
            this.type = type;
        }
        scope.prototype.setIsUsed = function (isUsed) {
            this.isUsed = isUsed;
        };
        scope.prototype.getIsUsed = function () {
            return this.isUsed;
        };
        scope.prototype.getValue = function () {
            return this.value;
        };
        scope.prototype.setValue = function (value) {
            this.value = value;
        };
        scope.prototype.getType = function () {
            return this.type;
        };
        scope.prototype.setType = function (type) {
            this.type = type;
        };
        return scope;
    }());
    mackintosh.scope = scope;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=scope.js.map