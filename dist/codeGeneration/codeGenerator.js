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
                this.genBlock(ASTTree.getRoot());
                this.break();
                //Once recursion ends, pass the executable image to be backpatched.
                _jumpTable.backpatch(_executableImage);
                _staticTable.backpatch(_executableImage);
                _Functions.log("CODE GENERATOR - Completed Code Generation " + (programCount - 1));
            }
            catch (error) {
                _Functions.log(error);
                _Functions.log("CODE GENERATOR - Code Generation ended due to error.");
            }
            return isGen;
        }
        static genBlock(astNode) {
            curScope++;
            _Functions.log("CODE GENERATOR - Block found, generating code for scope " + curScope);
            //Use good old recursion to travel through the ast and generate code.
            if (astNode.getChildren().length != 0) {
                for (let i = 0; i < astNode.getChildren().length; i++) {
                    this.genStatement(astNode.getChildren()[i]);
                }
            }
            _Functions.log("CODE GENERATOR - Generated code for scope " + curScope);
        }
        static genStatement(astNode) {
            let nodeVal = astNode.getNodeName();
            //Find out what type of node it is and generate code for it.
            if (nodeVal === "Block") {
                this.genBlock(astNode);
            }
            if (nodeVal === "VarDecl") {
                this.genVarDecl(astNode);
            }
            if (nodeVal === "PrintStatement") {
                this.genPrintStatement(astNode);
            }
            if (nodeVal === "IfStatement") {
                this.genIfStatement(astNode);
            }
            if (nodeVal === "WhileStatement") {
                this.genWhileStatement(astNode);
            }
        }
        static genVarDecl(astNode) {
        }
        static genAssignmentStatement(astNode) {
        }
        static genIdAssignmentStatement(astNode) {
        }
        static genBoolExpr(astNode) {
        }
        static genWhileStatement(astNode) {
        }
        static genIfStatement(astNode) {
        }
        static genPrintStatement(astNode) {
        }
        //Create methods for the 6502a op codes.
        //Load the accumulator with a constant.
        static ldaConst(data) {
            _executableImage.addToStack("A9");
            _executableImage.addToStack(data);
        }
        //Load the accumulator from memory.
        static ldaMem(data1, data2) {
            _executableImage.addToStack("AD");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }
        //Store from the accumulator.
        static sta(data1, data2) {
            _executableImage.addToStack("8D");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }
        //Add with carry.
        static adc(data1, data2) {
            _executableImage.addToStack("6D");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }
        //Load the x register with a constant.
        static ldxConst(data) {
            _executableImage.addToStack("A2");
            _executableImage.addToStack(data);
        }
        //Load the x register from memory.
        static ldxMem(data1, data2) {
            _executableImage.addToStack("AE");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }
        //Load the y register with a constant.
        static ldyConst(data) {
            _executableImage.addToStack("A0");
            _executableImage.addToStack(data);
        }
        //Load the y register from memory.
        static ldyMem(data1, data2) {
            _executableImage.addToStack("AC");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }
        static noOp() {
            _executableImage.addToStack("EA");
        }
        static break() {
            _executableImage.addToStack("00");
        }
        //Compare a byte in mem to the x register.
        static cpx(data1, data2) {
            _executableImage.addToStack("EC");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }
        //Branch not equal.
        static bne(data1, data2) {
            _executableImage.addToStack("D0");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }
        //Increment.
        static inc(data1, data2) {
            _executableImage.addToStack("EE");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }
        static system() {
            _executableImage.addToStack("FF");
        }
        static leftPad(data, length) {
            let temp = "" + data;
            while (temp.length < length) {
                temp = '0' + temp;
            }
            return temp;
        }
    }
    mackintosh.codeGenerator = codeGenerator;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=codeGenerator.js.map