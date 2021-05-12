var mackintosh;
(function (mackintosh) {
    class executableImage {
        constructor() {
            this.IMAGE_SIZE = 256;
            this.executableImage = new Array(this.IMAGE_SIZE);
            this.stackPointer = 0;
            this.heapPointer = this.executableImage.length - 1;
            //Initialize the executable image to be filled with 00.
            for (let i = 0; i < this.executableImage.length; i++) {
                this.executableImage[i] == "00";
            }
        }
        updateStackPointer(stackPointer) {
            this.stackPointer = stackPointer;
        }
        getStackPointer() {
            return this.stackPointer;
        }
        updateHeapPointer(heapPointer) {
            this.heapPointer = heapPointer;
        }
        getHeapPointer() {
            return this.heapPointer;
        }
        addToStack() {
            this.stackPointer++;
        }
        addToHeap() {
            this.heapPointer--;
        }
        addCode() {
        }
        checkOverflow() {
            if (this.stackPointer >= this.heapPointer) {
                genErr++;
                throw new Error("CODE GENERATOR - Stack Heap Collision - Program is too long.");
            }
        }
    }
    mackintosh.executableImage = executableImage;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=executableImage.js.map