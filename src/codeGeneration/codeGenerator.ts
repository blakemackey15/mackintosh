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
            let symbolNode = symbolTable.getNode(curScope);

            if(symbolNode == undefined || symbolNode == null) {
                symbolNode = symbolTable.getNode(curScope - 1);
            }

            _Functions.log("CODE GENERATOR - Block found, generating code for scope " + curScope);
            //Use good old recursion to travel through the ast and generate code.
            if(astNode.getChildren().length != 0) {
                for(let i = 0; i < astNode.getChildren().length; i++) {
                    this.genStatement(astNode.getChildren()[i], symbolNode);
                }
            }
            _Functions.log("CODE GENERATOR - Generated code for scope " + curScope);
        }

        public static genStatement(astNode : CSTNode, scope : symbolTableNode) {
            let nodeVal = astNode.getNodeName();
            //Find out what type of node it is and generate code for it.
            if(nodeVal === "Block") {
                this.genBlock(astNode);
            }

            else if(nodeVal === "VarDecl") {
                this.genVarDecl(astNode, scope);
            }

            else if(nodeVal === "AssignmentStatement") {
                this.genAssignmentStatement(astNode);
            }

            else if(nodeVal === "PrintStatement") {
                this.genPrintStatement(astNode, scope);
            }

            else if(nodeVal === "IfStatement") {
                this.genIfStatement(astNode, scope);
            }

            else if(nodeVal === "WhileStatement") {
                this.genWhileStatement(astNode, scope);
            }
        }

        public static genVarDecl(astNode : CSTNode, scope : symbolTableNode) {
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
            let node = symbolTable.getNode(curScope);
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
            let node = symbolTable.getNode(curScope);
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
            let node = symbolTable.getNode(curScope);
            let scope = node.getMap().get(id);
            let isId = node.lookup(value);

            //Check what data type it is to perform the correct assingment.
            //isId is not null or undefined so that means the value id exists in the symbol table.
            if(isId != null || isId != undefined) {
                this.genIdAssignmentStatement(astNode, id, value, node);
            }

            else if(scope.getType() === "int") {
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
            _Functions.log("CODE GENERATOR - Int assignment statement found.");
            //Pass the value to be evaluated.
            this.genIntExpr(astNode, node);
            let staticTableEntry = _staticTable.getByVarAndScope(id, node);
            this.sta(staticTableEntry.getTemp(), "XX");
            _Functions.log("CODE GENERATOR - Generated code for int assignment.");
        }

        public static genStringAssignmentStatement(astNode : CSTNode, id : string, value : string, node : symbolTableNode) {
            _Functions.log("CODE GENERATOR - String assignment statement found.");
            //Add the string to the heap, load the accumulator, and then store in memory.
            let pos;
            pos = _executableImage.addString(value);
            this.ldaConst(this.leftPad(pos.toString(16), 2));
            let staticTableEntry = _staticTable.getByVarAndScope(id, node);
            this.sta(staticTableEntry.getTemp(), "XX");
            _Functions.log("CODE GENERATOR - Generated code for string assignment statement.");
        }

        public static genBoolAssignmentStatement(astNode : CSTNode, id : string, value : string, node : symbolTableNode) {
            _Functions.log("CODE GENERATOR - Boolean assignment statement found.");
            _Functions.log("CODE GENERATOR - Generated code for boolean assignment statement.");
        }

        public static genIdAssignmentStatement(astNode : CSTNode, id : string, value : string, node : symbolTableNode) {
            _Functions.log("CODE GENERATOR - Id assignment statement found.");
            //Find the value in static table, load the accumulator.
            let valueEntry = _staticTable.getByVarAndScope(value, node);
            this.ldaMem(valueEntry.getTemp(), "XX");
            //Find the id in static table, load the accumulator.
            let staticTableEntry = _staticTable.getByVarAndScope(id, node);
            this.sta(staticTableEntry.getTemp(), "XX");
            _Functions.log("CODE GENERATOR - Generated code for ids assignment statement.");
        }

        public static genIntExpr(astNode : CSTNode, scope : symbolTableNode) {
            //Only one int, load accumulator with it - base case.
            if(astNode.getChildren().length == 2) {
                this.ldaConst(this.leftPad(astNode.getChildren()[1].getNodeName(), 2));
            }

            //Use recursion to evaluate an expression.
            else {
                this.genIntExpr(astNode.getChildren()[1], scope);
                this.sta("00", "00");
                this.ldaConst(this.leftPad(astNode.getChildren()[0].getNodeName(), 2));
                this.adc("00", "00");
            }
        }

        public static genBoolExpr(astNode : CSTNode, scope : symbolTableNode) {
            if(astNode.getChildren()[0].getNodeName() === "isEqual") {
                this.genIsEqual(astNode.getChildren()[0], scope);
            }

            else if(astNode.getChildren()[0].getNodeName() === "isNotEqual") {

            }

            else if(astNode.getChildren()[0].getNodeName() === "true") {

            }

            else if(astNode.getChildren()[0].getNodeName() === "false") {
                this.ldxConst("01");
                this.ldaConst("00");
                this.sta("00", "00");
                this.cpx("00", "00");
            }
        }

        public static genIsEqual(astNode : CSTNode, scope : symbolTableNode) {
            //Get the left side.
            let leftExprType = astNode.getChildren()[0].getNodeName();

            //Check what type of expr the left side is.
            if(digits.test(leftExprType)) {
                this.ldxConst(this.leftPad(astNode.getChildren()[0].getNodeName(), 2));
            }

            else if(quotes.test(leftExprType)) {
                //TODO: Figure out string comparison.
            }

            else if(leftExprType === "true" || leftExprType === "false") {
                //Check if true or false - 01 true and 00 false.
                if(astNode.getChildren()[0].getNodeName() === "true") {
                    this.ldxConst("01");
                }

                else {
                    this.ldxConst("00");
                }
            }

            //Handle id assignment.
            else if(characters.test(leftExprType) && leftExprType.length == 1) {
                let staticTableEntry = _staticTable.getByVarAndScope(leftExprType, scope);
                this.ldxMem(staticTableEntry.getTemp(), "XX");
            }

            //Get the right side and make the comparison.
            let rightExprType = astNode.getChildren()[1].getNodeName();
            
            //Check what type of expr the right side is.
            if(digits.test(rightExprType)) {
                this.ldaConst(this.leftPad(astNode.getChildren()[1].getNodeName(), 2));
                this.sta("00", "00");
                this.cpx("00", "00");
            }

            else if(quotes.test(rightExprType)) {

            }

            else if(rightExprType === "true" || rightExprType === "false") {
                //Check if true or false - 01 true and 00 false.
                if(astNode.getChildren()[1].getNodeName() === "true") {
                    this.ldxConst("01");
                }
                
                else {
                    this.ldxConst("00");
                }
            }

            else if(characters.test(rightExprType) && rightExprType.length == 1) {
                let staticTableEntry = _staticTable.getByVarAndScope(astNode.getChildren()[1].getNodeName(), scope);
                this.cpx(staticTableEntry.getTemp(), "00");
            }
        }

        public static genWhileStatement(astNode : CSTNode, scope : symbolTableNode) {
            _Functions.log("CODE GENERATOR - Found while statement.");
            //Set up jump table.
            //Seriously blake, you didn't forget the add one in the if statement so don't do it now!
            let jumpFrom = _executableImage.getStackPointer();
            this.genBoolExpr(astNode, scope);
            let jumpId = _jumpTable.getNextTemp();
            let newJumpTableEntry = _jumpTable.addEntry(new jumpTableEntry(jumpId, 0));
            this.bne(this.leftPad(_executableImage.getStackPointer().toString(16), 2));

            //Use recursion to generate the code for the following block.
            for(let i = 1; i < astNode.getChildren()[0].getChildren().length; i++) {
                this.genStatement(astNode.getChildren()[0].getChildren()[i], scope);
            }

            this.ldaConst("00");
            this.sta("00", "00");
            this.ldxConst("01");
            this.cpx("00", "00");
            this.bne(this.leftPad((_executableImage.getIMAGE_SIZE() - (_executableImage.getStackPointer() - jumpFrom + 2))
            .toString(16), 2));
            newJumpTableEntry.setDistance(_executableImage.getStackPointer() - jumpFrom + 1);
            _Functions.log("CODE GENERATOR - Generated code for while statement.");
        }

        public static genIfStatement(astNode : CSTNode, scope : symbolTableNode) {
            _Functions.log("CODE GENERATOR - Found if statement.");
            //Don't generate code on false equality.
            if(astNode.getChildren()[0].getChildren()[0].getNodeName() == "false" ) {
                return;
            }

            //Set up the jump table so the branch can be performed.
            //DONT FORGET TO ADD ONE SO THE JUMP DOESN'T HAVE AN OFF BY ONE ERROR.
            let jumpId = _jumpTable.getNextTemp();
            let newJumpTableEntry = _jumpTable.addEntry(new jumpTableEntry(jumpId, 0));
            this.genBoolExpr(astNode, scope);
            let jumpFrom = _executableImage.getStackPointer();
            this.bne(newJumpTableEntry.getTemp());

            //Use recursion to generate the code for the following block.
            this.genStatement(astNode.getChildren()[0].getChildren()[2], scope);

            //When recursion ends calculate the jump distance.
            //Once again, you better not forget to add 1!
            newJumpTableEntry.setDistance(_executableImage.getStackPointer() - jumpFrom + 1);
            _Functions.log("CODE GENERATOR - Generated Code for if statement.");
        }

        public static genPrintStatement(astNode : CSTNode, scope : symbolTableNode) {
            _Functions.log("CODE GENERATOR - Print statement found.");
            let exprType = astNode.getChildren()[0].getNodeName();

            //Check what we are trying to print.
            if(digits.test(exprType)) {
                //Generate the code for the int expr.
                this.genIntExpr(astNode, scope);
                this.sta("00", "00");
                //Make print system call.
                this.ldxConst("01");
                this.ldyMem("00", "00");
                this.sys();
            }

            else if(exprType == "true" || exprType == "false") {
                let bool = astNode.getChildren()[0].getNodeName();
                let location;
                let boolInHeap = _executableImage.searchHeap(bool);
                
                //Check if its in the heap.
                if(boolInHeap == null) {
                    location = _executableImage.addString(bool);
                }

                else {
                    location = boolInHeap;
                }

                this.ldaConst(location.toString(16));
                this.sta("00", "00");
                this.ldxConst("02");
                this.ldyMem("00", "00");
                this.sys();
            }

            else if(characters.test(exprType) && exprType.length > 1) {
                let pos; 
                pos = _executableImage.addString(astNode.getChildren()[0].getNodeName());
                this.ldaConst(pos.toString(16));
                this.sta("00", "00");
                //Make print system call.
                this.ldxConst("02");
                this.ldyMem("00", "00");
                this.sys();
            }

            else if(characters.test(exprType) && exprType.length == 1) {
                let staticTableEntry = _staticTable.getByVarAndScope(exprType, scope);
                this.ldyMem(staticTableEntry.getTemp(), "XX");
                let idScope = scope.lookup(astNode.getChildren()[0].getNodeName());
                if(idScope != null || idScope != undefined) {
                    if(idScope.getType() == "int") {
                        this.ldxConst("01");
                    }

                    else {
                        this.ldxConst("02");
                    }

                    this.sys();
                }
            }

            _Functions.log("CODE GENERATOR - Generated code for print statement.");
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
        public static bne(data1 : string) {
            _executableImage.addToStack("D0");
            _executableImage.addToStack(data1);
        }

        //Increment.
        public static inc(data1 : string, data2 : string) {
            _executableImage.addToStack("EE");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        }

        public static sys() {
            _executableImage.addToStack("FF");
        }

        public static leftPad(data : string, length : number) : string {
            let temp = "" + data;

            while(temp.length < length) {
                temp = "0" + temp;
            }

            return temp;
        }

    }
}