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
        addToStack(data) {
            this.addCode(data, this.stackPointer);
            this.stackPointer++;
            return this.stackPointer;
        }
        addToHeap(data) {
            this.addCode(data, this.heapPointer);
            this.heapPointer--;
            return this.heapPointer;
        }
        addCode(data, pointer) {
            //Check if the pointer is pointing to a valid space in the executable image.
            if (pointer >= this.IMAGE_SIZE || pointer < 0) {
                throw new Error("CODE GENERATOR - Invalid position " + pointer + " in executable image.");
            }
            //Check for collision in stack and heap.
            this.checkOverflow();
            this.executableImage[pointer] = data;
            return pointer;
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