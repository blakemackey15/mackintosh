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

        public addToStack(data : string) : number {
            this.addCode(data, this.stackPointer);
            this.stackPointer++;
            return this.stackPointer;
        }

        public addToHeap(data : string) : number {
            this.addCode(data, this.heapPointer);
            this.heapPointer--;
            return this.heapPointer;
        }

        public addCode(data : string, pointer : number) : number {
            //Check if the pointer is pointing to a valid space in the executable image.
            if(pointer >= this.IMAGE_SIZE || pointer < 0) {
                throw new Error("CODE GENERATOR - Invalid position " + pointer + " in executable image.");
            }

            //Check for collision in stack and heap.
            this.checkOverflow();
            this.executableImage[pointer] = data;
            return pointer;
        }

        public addStringHelper(string : string) : string {
            let pos;
            if(string.length <= 0) {
                pos = this.addToHeap("00");
            }
            //Null terminate the string.
            this.addToHeap("00");
            for(let i = string.length - 1; i >= 0; i--) {
                //Get the hexidecimal representation of each character in the string.
                //Then add it to the heap.
                let toHex = string.charCodeAt(i).toString(16);
                pos = this.addToHeap(toHex);
            }

            return pos;
        }

        public addString(string : string) : string {
            return this.addStringHelper(string);
        }

        public checkOverflow() {
            if(this.stackPointer >= this.heapPointer) {
                genErr++;
                throw new Error("CODE GENERATOR - Stack Heap Collision - Program is too long.");
            }
        }

        //Search the heap for a string.
        public searchHeap(data : string) : number {
            let string = "";
            for(let i = this.IMAGE_SIZE - 1; i >= this.heapPointer; i++) {
                if(this.executableImage[i] == "00") {
                    if(string == data) {
                        return i;
                    }
                }

                else {
                    string = String.fromCharCode(parseInt(this.executableImage[i], 16)) + string;
                }
            }

            return null;
        }

        public displayCode() : string {
            let code = "";
            //Traverse through the executable image and print out the generated code.
            for(let i = 0; i < this.IMAGE_SIZE; i++) {
                //Improves readability by adding a new line.
                if(i % 8 == 0 && i != 0) {
                    code += "\n";
                }
                code += this.executableImage[i] + " ";
            }

            return code;
        }
    }
}