module mackintosh {
    export class executableImage {
        private IMAGE_SIZE : number;
        private executableImage : Array<string>;
        private stackPointer : number;
        private heapPointer : number;

        constructor() {
            this.IMAGE_SIZE = 256;
            this.executableImage = new Array<string>(this.IMAGE_SIZE);
            this.stackPointer = 0;
            this.heapPointer = this.executableImage.length - 1;

            //Initialize the executable image to be filled with 00.
            for(let i = 0; i < this.executableImage.length; i++) {
                this.executableImage[i] == "00";
            }
        }

        public updateStackPointer(stackPointer : number) {
            this.stackPointer = stackPointer;
        }

        public getStackPointer() : number {
            return this.stackPointer;
        }

        public updateHeapPointer(heapPointer : number) {
            this.heapPointer = heapPointer;
        }

        public getHeapPointer() : number {
            return this.heapPointer;
        }

        public addToStack() {
            this.stackPointer++;
        }

        public addToHeap() {
            this.heapPointer--;
        }

        public addCode() {
            
        }

        public checkOverflow() {
            if(this.stackPointer >= this.heapPointer) {
                genErr++;
                throw new Error("CODE GENERATOR - Stack Heap Collision - Program is too long.");
            }
        }
    }
}