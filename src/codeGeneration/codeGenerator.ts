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
                this.genBlock(ASTTree.getRoot());
                this.break();
                //Once recursion ends, pass the executable image to be backpatched.
                _jumpTable.backpatch(_executableImage);
                _staticTable.backpatch(_executableImage);
                _Functions.log("CODE GENERATOR - Completed Code Generation " + (programCount - 1));

            } catch (error) {
                _Functions.log(error);
                _Functions.log("CODE GENERATOR - Code Generation ended due to error.");
            }
            return isGen;
        }

        public static genBlock(astNode : CSTNode) {
            curScope++;
            _Functions.log("CODE GENERATOR - Block found, generating code for scope " + curScope);
            //Use good old recursion to travel through the ast and generate code.
            if(astNode.getChildren().length != 0) {
                for(let i = 0; i < astNode.getChildren().length; i++) {
                    this.genStatement(astNode.getChildren()[i]);
                }
            }
            _Functions.log("CODE GENERATOR - Generated code for scope " + curScope);
        }

        public static genStatement(astNode : CSTNode) {
            let nodeVal = astNode.getNodeName();
            //Find out what type of node it is and generate code for it.
            if(nodeVal === "Block") {
                this.genBlock(astNode);
            }

            if(nodeVal === "VarDecl") {
                this.genVarDecl(astNode);
            }

            if(nodeVal === "PrintStatement") {
                this.genPrintStatement(astNode);
            }

            if(nodeVal === "IfStatement") {
                this.genIfStatement(astNode);
            }

            if(nodeVal === "WhileStatement") {
                this.genWhileStatement(astNode);
            }
        }

        public static genVarDecl(astNode : CSTNode) {

        }

        public static genAssignmentStatement(astNode : CSTNode) {

        }

        public static genIdAssignmentStatement(astNode : CSTNode) {

        }

        public static genBoolExpr(astNode : CSTNode) {
            
        }

        public static genWhileStatement(astNode : CSTNode) {

        }

        public static genIfStatement(astNode : CSTNode) {

        }

        public static genPrintStatement(astNode : CSTNode) {

        }

        //Create methods for the 6502a op codes.
        //Load the accumulator with a constant.
        public static ldaConst(data : string) {
            _executableImage.addToStack("A9");
            _executableImage.addToStack(data);
        }

        //Load the accumulator from memory.
        public static ldaMem(data1 : string, data2 : string) {
            _executableImage.addToStack("AD");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }

        //Store from the accumulator.
        public static sta(data1 : string, data2 : string) {
            _executableImage.addToStack("8D");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }

        //Add with carry.
        public static adc(data1 : string, data2 : string) {
            _executableImage.addToStack("6D");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }

        //Load the x register with a constant.
        public static ldxConst(data : string) {
            _executableImage.addToStack("A2");
            _executableImage.addToStack(data);
        }

        //Load the x register from memory.
        public static ldxMem(data1 : string, data2 : string) {
            _executableImage.addToStack("AE");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }

        //Load the y register with a constant.
        public static ldyConst(data : string) {
            _executableImage.addToStack("A0");
            _executableImage.addToStack(data);
        }

        //Load the y register from memory.
        public static ldyMem(data1 : string, data2 : string) {
            _executableImage.addToStack("AC");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }

        public static noOp() {
            _executableImage.addToStack("EA");
        }

        public static break() {
            _executableImage.addToStack("00");
        }

        //Compare a byte in mem to the x register.
        public static cpx(data1 : string, data2 : string) {
            _executableImage.addToStack("EC");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }

        //Branch not equal.
        public static bne(data1 : string, data2 : string) {
            _executableImage.addToStack("D0");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }

        //Increment.
        public static inc(data1 : string, data2 : string) {
            _executableImage.addToStack("EE");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }

        public static system() {
            _executableImage.addToStack("FF");
        }

        public static leftPad(data : string, length : number) {
            let temp = "" + data;

            while(temp.length < length) {
                temp = '0' + temp;
            }

            return temp;
        }

    }
}