var mackintosh;
(function (mackintosh) {
    //Perform code generation.
    class codeGenerator {
        static codeGeneration() {
            debugger;
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
                //_Functions.log(_executableImage.displayCode());
                _executableImage.initTable();
                this.genBlock(ASTTree.getRoot());
                this.break();
                //Once recursion ends, pass the executable image to be backpatched.
                if (genErr == 0) {
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
            }
            catch (error) {
                _Functions.log(error);
                _Functions.log("CODE GENERATOR - Code Generation ended due to error.");
            }
            return isGen;
        }
        static genBlock(astNode) {
            curScope++;
            let symbolNode = symbolTable.getNode(curScope);
            _Functions.log("CODE GENERATOR - Block found, generating code for scope " + curScope);
            //Use good old recursion to travel through the ast and generate code.
            if (astNode.getChildren().length != 0) {
                for (let i = 0; i < astNode.getChildren().length; i++) {
                    this.genStatement(astNode.getChildren()[i], symbolNode);
                }
            }
            _Functions.log("CODE GENERATOR - Generated code for scope " + curScope);
        }
        static genStatement(astNode, scope) {
            let nodeVal = astNode.getNodeName();
            //Find out what type of node it is and generate code for it.
            if (nodeVal === "Block") {
                this.genBlock(astNode);
            }
            if (nodeVal === "VarDecl") {
                this.genVarDecl(astNode, scope);
            }
            if (nodeVal === "PrintStatement") {
                this.genPrintStatement(astNode, scope);
            }
            if (nodeVal === "IfStatement") {
                this.genIfStatement(astNode, scope);
            }
            if (nodeVal === "WhileStatement") {
                this.genWhileStatement(astNode, scope);
            }
        }
        static genVarDecl(astNode, scope) {
            let type = astNode.getChildren()[0].getNodeName();
            let id = astNode.getChildren()[1].getNodeName();
            //Check what type of node this is to generate the correct code.
            if (type === "int") {
                this.genIntVarDecl(astNode, id);
            }
            else if (type === "string") {
                this.genStringVarDecl(astNode, id);
            }
            else if (type === "boolean") {
                this.genBoolVarDecl(astNode, id);
            }
        }
        static genIntVarDecl(astNode, id) {
            _Functions.log("CODE GENERATOR - Int Var Decl Found.");
            //Initialze to 0.
            this.ldaConst("00");
            let temp = _staticTable.getNextTemp();
            let node = symbolTable.getNode(curScope);
            let scope = node.getMap().get(id);
            //Add the entry to the static table, and then store the temp data.
            let newEntry = new mackintosh.staticTableEntry(temp, id, _staticTable.getNextOffset(), scope);
            _staticTable.addEntry(newEntry);
            this.sta(temp, "XX");
            _Functions.log("CODE GENERATOR - Generated code for Int Var Decl.");
        }
        static genStringVarDecl(astNode, id) {
            _Functions.log("CODE GENERATOR - String Var Decl Found.");
            let tempId = _staticTable.getNextTemp();
            let node = symbolTable.getNode(curScope);
            let scope = node.getMap().get(id);
            _staticTable.addEntry(new mackintosh.staticTableEntry(tempId, id, _staticTable.getNextOffset(), scope));
            _Functions.log("CODE GENERATOR - Generated code for String Var Decl.");
        }
        static genBoolVarDecl(astNode, id) {
            _Functions.log("CODE GENERATOR - Bool Var Decl Found.");
            _Functions.log("CODE GENERATOR - Generated code for Bool Var Decl.");
        }
        static genAssignmentStatement(astNode) {
            let id = astNode.getChildren()[0].getNodeName();
            let value = astNode.getChildren()[1].getNodeName();
            let node = symbolTable.getNode(curScope);
            let scope = node.getMap().get(id);
            let isId = node.lookup(value);
            //Check what data type it is to perform the correct assingment.
            //isId is not null or undefined so that means the value id exists in the symbol table.
            if (isId != null || isId != undefined) {
                this.genIdAssignmentStatement(astNode, id, value, node);
            }
            if (scope.getType() === "int") {
                this.genIntAssignmentStatement(astNode, id, value, node);
            }
            else if (scope.getType() === "string") {
                this.genStringAssignmentStatement(astNode, id, value, node);
            }
            else if (scope.getType() === "boolean") {
                this.genBoolAssignmentStatement(astNode, id, value, node);
            }
        }
        static genIntAssignmentStatement(astNode, id, value, node) {
            this.genIntExpr(astNode, node);
            let staticTableEntry = _staticTable.getByVarAndScope(id, node);
            this.sta(staticTableEntry.getTemp(), "XX");
            _Functions.log("CODE GENERATOR - Generated code for int assignment.");
        }
        static genStringAssignmentStatement(astNode, id, value, node) {
            //Add the string to the heap, load the accumulator, and then store in memory.
            let pos = _executableImage.addString(value);
            this.ldaConst(this.leftPad(pos, 2));
            let staticTableEntry = _staticTable.getByVarAndScope(id, node);
            this.sta(staticTableEntry.getTemp(), "XX");
            _Functions.log("CODE GENERATOR - Generated code for string assignment statement.");
        }
        static genBoolAssignmentStatement(astNode, id, value, node) {
            _Functions.log("CODE GENERATOR - Generated code for boolean assignment statement.");
        }
        static genIdAssignmentStatement(astNode, id, value, node) {
            //Find the value in static table, load the accumulator.
            let valueEntry = _staticTable.getByVarAndScope(value, node);
            this.ldaMem(valueEntry.getTemp(), "XX");
            //Find the id in static table, load the accumulator.
            let staticTableEntry = _staticTable.getByVarAndScope(id, node);
            this.sta(staticTableEntry.getTemp(), "XX");
            _Functions.log("CODE GENERATOR - Generated code for ids assignment statement.");
        }
        static genIntExpr(astNode, scope) {
            //Check how many children there are to determine the length of the expr.
            if (astNode.getChildren().length > 1) {
            }
            //Only one int, load accumulator with it - base case.
            else if (astNode.getChildren().length == 1) {
                this.ldaConst(this.leftPad(astNode.getChildren()[0].getNodeName(), 2));
            }
            //Use recursion to evaluate an expression.
            else {
                this.genIntExpr(astNode.getChildren()[0], scope);
                this.sta("00", "00");
                this.ldaConst(this.leftPad(astNode.getChildren()[0].getNodeName(), 2));
                this.adc("00", "00");
            }
        }
        static genBoolExpr(astNode, scope) {
            if (astNode.getChildren()[0].getNodeName() === "isEqual") {
                this.genIsEqual(astNode.getChildren()[0], scope);
            }
            else if (astNode.getChildren()[0].getNodeName() === "isNotEqual") {
            }
            else if (astNode.getChildren()[0].getNodeName() === "true") {
            }
            else if (astNode.getChildren()[0].getNodeName() === "false") {
                this.ldxConst("01");
                this.ldaConst("00");
                this.sta("00", "00");
                this.cpx("00", "00");
            }
        }
        static genIsEqual(astNode, scope) {
            //Get the left side.
            let leftExprType = astNode.getChildren()[0].getNodeName();
            //Check what type of expr the left side is.
            if (leftExprType === "IntExpr") {
                this.ldxConst(this.leftPad(astNode.getChildren()[0].getChildren()[0].getNodeName(), 2));
            }
            else if (leftExprType === "StringExpr") {
                //TODO: Figure out string comparison.
            }
            else if (leftExprType === "BooleanExpr") {
                //Check if true or false - 01 true and 00 false.
                if (astNode.getChildren()[0].getChildren()[0].getNodeName() === "true") {
                    this.ldxConst("01");
                }
                else {
                    this.ldxConst("00");
                }
            }
            //Handle id assignment.
            else if (characters.test(leftExprType) && leftExprType.length == 1) {
                let staticTableEntry = _staticTable.getByVarAndScope(leftExprType, scope);
                this.ldxMem(staticTableEntry.getTemp(), "XX");
            }
            //Get the right side and make the comparison.
            let rightExprType = astNode.getChildren()[1].getNodeName();
            //Check what type of expr the right side is.
            if (rightExprType === "IntExpr") {
                this.ldaConst(this.leftPad(astNode.getChildren()[1].getChildren()[0].getNodeName(), 2));
                this.sta("00", "00");
                this.cpx("00", "00");
            }
            else if (rightExprType === "StringExpr") {
            }
            else if (rightExprType === "BooleanExpr") {
                //Check if true or false - 01 true and 00 false.
                if (astNode.getChildren()[1].getChildren()[0].getNodeName() === "true") {
                    this.ldxConst("01");
                }
                else {
                    this.ldxConst("00");
                }
            }
            else if (characters.test(rightExprType) && rightExprType.length == 1) {
                let staticTableEntry = _staticTable.getByVarAndScope(astNode.getChildren()[1]
                    .getChildren()[0].getNodeName(), scope);
                this.cpx(staticTableEntry.getTemp(), "00");
            }
        }
        static genWhileStatement(astNode, scope) {
        }
        static genIfStatement(astNode, scope) {
        }
        static genPrintStatement(astNode, scope) {
            let exprType = astNode.getChildren()[0].getNodeName();
            //Check what we are trying to print.
            if (exprType === "StringExpr") {
                let pos = _executableImage.addString(astNode.getChildren()[0].getChildren()[0].getNodeName());
                this.ldaConst(pos);
                this.sta("00", "00");
                //Make print system call.
                this.ldxConst("02");
                this.ldyMem("00", "00");
                this.sys();
            }
            else if (exprType === "IntExpr") {
                //Generate the code for the int expr.
                this.genIntExpr(astNode, scope);
                this.sta("00", "00");
                //Make print system call.
                this.ldxConst("01");
                this.ldyMem("00", "00");
                this.sys();
            }
            else if (exprType === "BooleanExpr") {
                let bool = astNode.getChildren()[0].getChildren()[0].getNodeName();
                let location;
                let boolInHeap = _executableImage.searchHeap(bool);
                //Check if its in the heap.
                if (boolInHeap == null) {
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
            else if (exprType === "Id") {
                let staticTableEntry = _staticTable.getByVarAndScope(astNode.getChildren()[0]
                    .getChildren()[0].getNodeName(), scope);
                this.ldyMem(staticTableEntry.getTemp(), "XX");
                let map = scope.getMap();
                let idScope = scope.getMap().get(astNode.getChildren()[0].getChildren()[0].getNodeName());
                if (idScope != null || idScope != undefined) {
                    if (idScope.getType() == "int") {
                        this.ldxConst("01");
                    }
                    else {
                        this.ldxConst("02");
                    }
                    this.sys();
                }
            }
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
        static sys() {
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