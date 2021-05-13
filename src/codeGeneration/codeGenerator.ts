module mackintosh {
    export class codeGenerator {
        public static codeGeneration() : boolean {
            let isGen = false;
            genErr = 0;
            genWarn = 0;
            curScope = 0;
            _executableImage = new executableImage();
            _jumpTable = new jumpTable();
            _staticTable = new staticTable();
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("CODE GENERATOR - Beginning Code Generation " + (programCount - 1));

            try {
                
            } catch (error) {
                _Functions.log(error);
                _Functions.log("CODE GENERATOR - Code Generation ended due to error.");
            }
            return isGen;
        }

        //Create methods for the 6502a op codes.
        public static ldaConst(btye1 : number) {

        }

        public static ldaMem(btye1 : number, byte2 : number) {

        }

        public static sta(byte1 : number, byte2 : number) {

        }

        public static adc(byte1 : number, byte2 : number) {

        }

        public static ldxConst(byte1 : number) {

        }

        public static ldxMem(byte1 : number, byte2 : number) {

        }

        public static ldyConst(byte1 : number) {

        }

        public static ldyMem(byte1 : number, byte2 : number) {

        }

        public static noOp() {

        }

        public static break() {

        }

        public static cpx(byte1 : number, byte2 : number) {

        }

        public static bne(byte1 : number, byte2 : number) {

        }

        public static inc(byte1 : number, byte2 : number) {

        }

        public static system() {

        }

        public static leftPad(data : number, length : number) {
            let temp = "" + data;
            while(temp.length < length) {
                temp = '0' + temp;
            }
        }

    }
}