var mackintosh;
(function (mackintosh) {
    class codeGenerator {
        static codeGeneration() {
            let isGen = false;
            genErr = 0;
            genWarn = 0;
            curScope = 0;
            _executableImage = new mackintosh.executableImage();
            _jumpTable = new mackintosh.jumpTable();
            _staticTable = new mackintosh.staticTable();
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("CODE GENERATOR - Beginning Code Generation " + (programCount - 1));
            try {
            }
            catch (error) {
                _Functions.log(error);
                _Functions.log("CODE GENERATOR - Code Generation ended due to error.");
            }
            return isGen;
        }
        //Create methods for the 6502a op codes.
        static ldaConst(btye1) {
        }
        static ldaMem(btye1, byte2) {
        }
        static sta(byte1, byte2) {
        }
        static adc(byte1, byte2) {
        }
        static ldxConst(byte1) {
        }
        static ldxMem(byte1, byte2) {
        }
        static ldyConst(byte1) {
        }
        static ldyMem(byte1, byte2) {
        }
        static noOp() {
        }
        static break() {
        }
        static cpx(byte1, byte2) {
        }
        static bne(byte1, byte2) {
        }
        static inc(byte1, byte2) {
        }
        static system() {
        }
        static leftPad(data, length) {
            let temp = "" + data;
            while (temp.length < length) {
                temp = '0' + temp;
            }
        }
    }
    mackintosh.codeGenerator = codeGenerator;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=codeGenerator.js.map