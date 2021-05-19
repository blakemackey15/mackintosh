module mackintosh {
    //Perform code generation.
    export class codeGenerator {
        public static codeGeneration() : boolean {
            debugger;
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
                //_Functions.log(_executableImage.displayCode());
                _executableImage.initTable();
                this.genBlock(ASTTree.getRoot());
                this.break();
                //Once recursion ends, pass the executable image to be backpatched.
                if(genErr == 0) {
                    _jumpTable.backpatch(_executableImage);
                    _staticTable.backpatch(_executableImage);
                    _Functions.log("\n");
                    _Functions.log("\n");
                    _Functions.log("CODE GENERATOR - Completed Code Generation " + (programCount - 1));
                    _Functions.log("\n");
                    _Functions.log("\n");
                    _Functions.log(_executableImage.displayCode());
                    isGen = true;
                }

                else {
                    isGen = false;
                    _Functions.log("\n");
                    _Functions.log("\n");
                    _Functions.log("CODE GENERATOR - Generated code not displayed due to error.");
                }

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
            let type = astNode.getChildren()[0].getNodeName();
            let id = astNode.getChildren()[1].getNodeName();

            //Check what type of node this is to generate the correct code.
            if(type === "int") {
                this.genIntVarDecl(astNode, id);
            }

            else if(type === "string") {
                this.genStringVarDecl(astNode, id);
            }

            else if(type === "boolean") {
                this.genBoolVarDecl(astNode, id);
            }
        }

        public static genIntVarDecl(astNode : CSTNode, id : string) {
            _Functions.log("CODE GENERATOR - Int Var Decl Found.");
            //Initialze to 0.
            this.ldaConst("00");
            let temp = _staticTable.getNextTemp();
            let node = symbolTable.getNode(curScope, id);
            let scope = node.getMap().get(id);
            //Add the entry to the static table, and then store the temp data.
            let newEntry = new staticTableEntry(temp, id,_staticTable.getNextOffset(), scope);
            _staticTable.addEntry(newEntry);
            this.sta(temp, "XX");
            _Functions.log("CODE GENERATOR - Generated code for Int Var Decl.");
        }

        public static genStringVarDecl(astNode : CSTNode, id : string) {
            _Functions.log("CODE GENERATOR - String Var Decl Found.");
            let tempId = _staticTable.getNextTemp();
            let node = symbolTable.getNode(curScope, id);
            let scope = node.getMap().get(id);
            _staticTable.addEntry(new staticTableEntry(tempId, id, _staticTable.getNextOffset(), scope));
            _Functions.log("CODE GENERATOR - Generated code for String Var Decl.");
        }

        public static genBoolVarDecl(astNode : CSTNode, id : string) {
            _Functions.log("CODE GENERATOR - Bool Var Decl Found.");
            _Functions.log("CODE GENERATOR - Generated code for Bool Var Decl.");
        }

        public static genAssignmentStatement(astNode : CSTNode) {
            let id = astNode.getChildren()[0].getNodeName();
            let value = astNode.getChildren()[1].getNodeName();
            let node = symbolTable.getNode(curScope, id);
            let scope = node.getMap().get(id);

            //TODO : handle assigning a variable to another variable.
            //Check what data type it is to perform the correct assingment.
            if(scope.getType() === "int") {
                this.genIntAssignmentStatement(astNode, id, value, node)
            }

            else if(scope.getType() === "string") {
                this.genStringAssignmentStatement(astNode, id, value, node);
            }

            else if(scope.getType() === "boolean") {
                this.genBoolAssignmentStatement(astNode, id, value, node);
            }
        }

        public static genIntAssignmentStatement(astNode : CSTNode, id : string, value : string, node : symbolTableNode) {
            this.genIntExpr(astNode, node.getMap().get(id));
            let staticTableEntry = _staticTable.getByVarAndScope(id, node);
            this.sta(staticTableEntry.getTemp(), "XX");
            _Functions.log("CODE GENERATOR - Generated code for int assignment.");
        }

        public static genStringAssignmentStatement(astNode : CSTNode, id : string, value : string, node : symbolTableNode) {
            //Add the string to the heap, load the accumulator, and then store in memory.
            let pos = _executableImage.addString(value);
            this.ldaConst(this.leftPad(pos, 2));
            let staticTableEntry = _staticTable.getByVarAndScope(id, node);
            this.sta(staticTableEntry.getTemp(), "XX");
            _Functions.log("CODE GENERATOR - Generated code for string assignment statement.");
        }

        public static genBoolAssignmentStatement(astNode : CSTNode, id : string, value : string, node : symbolTableNode) {
            _Functions.log("CODE GENERATOR - Generated code for boolean assignment statement.");
        }

        public static genIdAssignmentStatement(astNode : CSTNode, id : string, value : string, node : symbolTableNode) {
            //Find the value in static table, load the accumulator.
            let valueEntry = _staticTable.getByVarAndScope(value, node);
            this.ldaMem(valueEntry.getTemp(), "XX");
            //Find the id in static table, load the accumulator.
            let staticTableEntry = _staticTable.getByVarAndScope(id, node);
            this.sta(staticTableEntry.getTemp(), "XX");
            _Functions.log("CODE GENERATOR - Generated code for ids assignment statement.");
        }

        public static genIntExpr(astNode : CSTNode, scope : scope) {

        }

        public static genStringExpr(astNode : CSTNode) {

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