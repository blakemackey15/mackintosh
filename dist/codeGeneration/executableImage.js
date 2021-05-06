var mackintosh;
(function (mackintosh) {
    var executableImage = /** @class */ (function () {
        function executableImage() {
            this.IMAGE_SIZE = 256;
            this.executableImage = new Array(this.IMAGE_SIZE);
            this.stackPointer = 0;
            this.heapPointer = this.executableImage.length - 1;
            //Initialize the executable image to be filled with 00.
            for (var i = 0; i < this.executableImage.length; i++) {
                this.executableImage[i] == "00";
            }
        }
        executableImage.prototype.updateStackPointer = function (stackPointer) {
            this.stackPointer = stackPointer;
        };
        executableImage.prototype.getStackPointer = function () {
            return this.stackPointer;
        };
        executableImage.prototype.updateHeapPointer = function (heapPointer) {
            this.heapPointer = heapPointer;
        };
        executableImage.prototype.getHeapPointer = function () {
            return this.heapPointer;
        };
        executableImage.prototype.addToStack = function () {
            this.stackPointer++;
        };
        executableImage.prototype.addToHeap = function () {
            this.heapPointer--;
        };
        executableImage.prototype.addCode = function () {
        };
        executableImage.prototype.checkOverflow = function () {
            if (this.stackPointer >= this.heapPointer) {
                genErr++;
                throw new Error("CODE GENERATOR - Stack Heap Collision - Program is too long.");
            }
        };
        return executableImage;
    }());
    mackintosh.executableImage = executableImage;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=executableImage.js.map