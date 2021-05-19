var mackintosh;
(function (mackintosh) {
    var compilerFunctions = /** @class */ (function () {
        function compilerFunctions() {
        }
        //Remove whitespaces.
        compilerFunctions.trim = function (srcCode) {
            //Regex to identify whitespaces and replace it with empty string.
            return srcCode.replace(/^\s+ | \s+$/g, "");
        };
        //Logs a message to the html output area. Was originally in the index.html file but I moved it here
        //so it can be used by other classes in the mackintosh module. Just makes it a bit more simple (I hope).
        compilerFunctions.log = function (message) {
            document.getElementById("output").value += message + "\n";
        };
        return compilerFunctions;
    }());
    mackintosh.compilerFunctions = compilerFunctions;
})(mackintosh || (mackintosh = {}));
//Used to declare global variables and start compiler.
//These variables represent the classes in the mackitosh module, and can be referenced in the 
//index by linking the mackintosh.js script.
//Declare lexer, parser, and token.
var _Compiler = mackintosh.index;
var _Lexer = mackintosh.lex;
var _Parser = mackintosh.parse;
var _Token = mackintosh.token;
var _Functions = mackintosh.compilerFunctions;
var _SemanticAnalyzer = mackintosh.semanticAnalyser;
var _CodeGenerator = mackintosh.codeGenerator;
var symbolTable = new mackintosh.symbolTableTree;
//Lex errors.
var errCount = 0;
//Parse errors.
var parseErrCount = 0;
//Lex warnings.
var warnCount = 0;
//Parse warnings.
var parseWarnCount = 0;
var tokenIndex = 0;
var curToken;
var isCompiling;
var program = new Array();
var programCount = 1;
var lineNum = 1;
var tokenFlag;
var tokenBuffer = 0;
var keywords = new Array("int", "print", "while", "string", "boolean", "while", "true", "false", "if");
//Regular Expressions to check token type.
var digits = new RegExp('(?:0|[1-9]\d*)');
var characters = new RegExp('^[a-z]*$');
var leftBlock = new RegExp('[{]');
var rightBlock = new RegExp('[}]');
var operator = new RegExp('[+]');
var boolOperator = new RegExp('(?:^|[^!=])([!=]=)(?!=)');
var endProgram = new RegExp('[$]');
var quotes = new RegExp('["]');
var intRegEx = new RegExp('in(t)');
var stringRegEx = new RegExp('strin(g)');
var printRegEx = new RegExp('prin(t)');
var falseRegEx = new RegExp('fals(e)');
var trueRegEx = new RegExp('tru(e)');
var ifRegEx = new RegExp('i(f)');
var whileRegEx = new RegExp('whil(e)');
var boolRegEx = new RegExp('boolea(n)');
var openComments = new RegExp('[\/\*]');
var closeComments = new RegExp('[\*\/]');
var assignment = new RegExp('[=]');
var newLine = new RegExp('\n');
var whitespace = new RegExp('[ \t]');
//Parser globals.
var CSTTree = new mackintosh.CST;
var isMatch = false;
var tokenPointer = 0;
var ASTTree = new mackintosh.CST;
var isASTNode = false;
//Semantic Analysis Globals
var scopePointer = 0;
var semErr = 0;
var semWarn = 0;
//Code gen globals
var genErr = 0;
var genWarn = 0;
var _executableImage = new mackintosh.executableImage;
var _staticTable = new mackintosh.staticTable;
var _jumpTable = new mackintosh.jumpTable;
var curScope = 0;
var tempIdMatch = new RegExp('/^(J[0-9])/');
/*
References: Here is a list of the resources I referenced while developing this project.
https://regex101.com/ - Useful tool I used to test my regular expressions for my tokens.
*/
var mackintosh;
(function (mackintosh) {
    var index = /** @class */ (function () {
        function index() {
        }
        //Begins the compilation of the inputted code.
        index.startCompile = function () {
            //Set compilation flag to true.
            isCompiling = true;
            _Functions.log('INFO: Beginning Compilation...');
            //Get source code from text area input.
            var code = document.getElementById("inputCode").value;
            //code = mackintosh.compilerFunctions.trim(code);
            _Lexer.populateProgram(code);
            _Lexer.lex();
            //Check if there is a $ at the end of the program, if not display warning.
            if (program[program.length - 1] != '$') {
                _Functions.log('LEXER WARNING: End of Program $ Not Found.');
                warnCount++;
            }
            return isCompiling;
        };
        index.endCompile = function () {
            isCompiling == false;
            return isCompiling;
        };
        return index;
    }());
    mackintosh.index = index;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    //Perform code generation.
    var codeGenerator = /** @class */ (function () {
        function codeGenerator() {
        }
        codeGenerator.codeGeneration = function () {
            debugger;
            var isGen = false;
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
        };
        codeGenerator.genBlock = function (astNode) {
            curScope++;
            _Functions.log("CODE GENERATOR - Block found, generating code for scope " + curScope);
            //Use good old recursion to travel through the ast and generate code.
            if (astNode.getChildren().length != 0) {
                for (var i = 0; i < astNode.getChildren().length; i++) {
                    this.genStatement(astNode.getChildren()[i]);
                }
            }
            _Functions.log("CODE GENERATOR - Generated code for scope " + curScope);
        };
        codeGenerator.genStatement = function (astNode) {
            var nodeVal = astNode.getNodeName();
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
        };
        codeGenerator.genVarDecl = function (astNode) {
            var type = astNode.getChildren()[0].getNodeName();
            var id = astNode.getChildren()[1].getNodeName();
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
        };
        codeGenerator.genIntVarDecl = function (astNode, id) {
            _Functions.log("CODE GENERATOR - Int Var Decl Found.");
            //Initialze to 0.
            this.ldaConst("00");
            var temp = _staticTable.getNextTemp();
            var node = symbolTable.getNode(curScope, id);
            var scope = node.getMap().get(id);
            //Add the entry to the static table, and then store the temp data.
            var newEntry = new mackintosh.staticTableEntry(temp, id, _staticTable.getNextOffset(), scope);
            _staticTable.addEntry(newEntry);
            this.sta(temp, "XX");
            _Functions.log("CODE GENERATOR - Generated code for Int Var Decl.");
        };
        codeGenerator.genStringVarDecl = function (astNode, id) {
            _Functions.log("CODE GENERATOR - String Var Decl Found.");
            var tempId = _staticTable.getNextTemp();
            var node = symbolTable.getNode(curScope, id);
            var scope = node.getMap().get(id);
            _staticTable.addEntry(new mackintosh.staticTableEntry(tempId, id, _staticTable.getNextOffset(), scope));
            _Functions.log("CODE GENERATOR - Generated code for String Var Decl.");
        };
        codeGenerator.genBoolVarDecl = function (astNode, id) {
            _Functions.log("CODE GENERATOR - Bool Var Decl Found.");
            _Functions.log("CODE GENERATOR - Generated code for Bool Var Decl.");
        };
        codeGenerator.genAssignmentStatement = function (astNode) {
            var id = astNode.getChildren()[0].getNodeName();
            var value = astNode.getChildren()[1].getNodeName();
            var node = symbolTable.getNode(curScope, id);
            var scope = node.getMap().get(id);
            //TODO : handle assigning a variable to another variable.
            //Check what data type it is to perform the correct assingment.
            if (scope.getType() === "int") {
                this.genIntAssignmentStatement(astNode, id, value, node);
            }
            else if (scope.getType() === "string") {
                this.genStringAssignmentStatement(astNode, id, value, node);
            }
            else if (scope.getType() === "boolean") {
                this.genBoolAssignmentStatement(astNode, id, value, node);
            }
        };
        codeGenerator.genIntAssignmentStatement = function (astNode, id, value, node) {
            this.genIntExpr(astNode, node.getMap().get(id));
            var staticTableEntry = _staticTable.getByVarAndScope(id, node);
            this.sta(staticTableEntry.getTemp(), "XX");
            _Functions.log("CODE GENERATOR - Generated code for int assignment.");
        };
        codeGenerator.genStringAssignmentStatement = function (astNode, id, value, node) {
            //Add the string to the heap, load the accumulator, and then store in memory.
            var pos = _executableImage.addString(value);
            this.ldaConst(this.leftPad(pos, 2));
            var staticTableEntry = _staticTable.getByVarAndScope(id, node);
            this.sta(staticTableEntry.getTemp(), "XX");
            _Functions.log("CODE GENERATOR - Generated code for string assignment statement.");
        };
        codeGenerator.genBoolAssignmentStatement = function (astNode, id, value, node) {
            _Functions.log("CODE GENERATOR - Generated code for boolean assignment statement.");
        };
        codeGenerator.genIdAssignmentStatement = function (astNode, id, value, node) {
            //Find the value in static table, load the accumulator.
            var valueEntry = _staticTable.getByVarAndScope(value, node);
            this.ldaMem(valueEntry.getTemp(), "XX");
            //Find the id in static table, load the accumulator.
            var staticTableEntry = _staticTable.getByVarAndScope(id, node);
            this.sta(staticTableEntry.getTemp(), "XX");
            _Functions.log("CODE GENERATOR - Generated code for ids assignment statement.");
        };
        codeGenerator.genIntExpr = function (astNode, scope) {
        };
        codeGenerator.genStringExpr = function (astNode) {
        };
        codeGenerator.genBoolExpr = function (astNode) {
        };
        codeGenerator.genWhileStatement = function (astNode) {
        };
        codeGenerator.genIfStatement = function (astNode) {
        };
        codeGenerator.genPrintStatement = function (astNode) {
        };
        //Create methods for the 6502a op codes.
        //Load the accumulator with a constant.
        codeGenerator.ldaConst = function (data) {
            _executableImage.addToStack("A9");
            _executableImage.addToStack(data);
        };
        //Load the accumulator from memory.
        codeGenerator.ldaMem = function (data1, data2) {
            _executableImage.addToStack("AD");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        };
        //Store from the accumulator.
        codeGenerator.sta = function (data1, data2) {
            _executableImage.addToStack("8D");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        };
        //Add with carry.
        codeGenerator.adc = function (data1, data2) {
            _executableImage.addToStack("6D");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        };
        //Load the x register with a constant.
        codeGenerator.ldxConst = function (data) {
            _executableImage.addToStack("A2");
            _executableImage.addToStack(data);
        };
        //Load the x register from memory.
        codeGenerator.ldxMem = function (data1, data2) {
            _executableImage.addToStack("AE");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        };
        //Load the y register with a constant.
        codeGenerator.ldyConst = function (data) {
            _executableImage.addToStack("A0");
            _executableImage.addToStack(data);
        };
        //Load the y register from memory.
        codeGenerator.ldyMem = function (data1, data2) {
            _executableImage.addToStack("AC");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        };
        codeGenerator.noOp = function () {
            _executableImage.addToStack("EA");
        };
        codeGenerator.break = function () {
            _executableImage.addToStack("00");
        };
        //Compare a byte in mem to the x register.
        codeGenerator.cpx = function (data1, data2) {
            _executableImage.addToStack("EC");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        };
        //Branch not equal.
        codeGenerator.bne = function (data1, data2) {
            _executableImage.addToStack("D0");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        };
        //Increment.
        codeGenerator.inc = function (data1, data2) {
            _executableImage.addToStack("EE");
            _executableImage.addToStack(data1);
            _executableImage.addToStack(data2);
        };
        codeGenerator.system = function () {
            _executableImage.addToStack("FF");
        };
        codeGenerator.leftPad = function (data, length) {
            var temp = "" + data;
            while (temp.length < length) {
                temp = '0' + temp;
            }
            return temp;
        };
        return codeGenerator;
    }());
    mackintosh.codeGenerator = codeGenerator;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    var executableImage = /** @class */ (function () {
        function executableImage() {
            this.IMAGE_SIZE = 256;
            this.executableImage = new Array(this.IMAGE_SIZE);
            this.stackPointer = 0;
            this.heapPointer = this.executableImage.length - 1;
        }
        executableImage.prototype.initTable = function () {
            //Initialize the executable image to be filled with 00.
            for (var i = 0; i < this.IMAGE_SIZE; i++) {
                if (this.executableImage[i] === null || this.executableImage[i] === undefined) {
                    this.executableImage[i] = "00";
                }
            }
        };
        executableImage.prototype.updateStackPointer = function (stackPointer) {
            this.stackPointer = stackPointer;
        };
        executableImage.prototype.getStackPointer = function () {
            return this.stackPointer;
        };
        executableImage.prototype.updateHeapPointer = function (heapPointer) {
            this.heapPointer = heapPointer;
        };
        executableImage.prototype.getHeapPointer = function () {
            return this.heapPointer;
        };
        executableImage.prototype.addToStack = function (data) {
            this.addCode(data, this.stackPointer);
            this.stackPointer++;
            return this.stackPointer;
        };
        executableImage.prototype.addToHeap = function (data) {
            this.addCode(data, this.heapPointer);
            this.heapPointer--;
            return this.heapPointer;
        };
        executableImage.prototype.addCode = function (data, pointer) {
            //Check if the pointer is pointing to a valid space in the executable image.
            if (pointer >= this.IMAGE_SIZE || pointer < 0) {
                genErr++;
                throw new Error("CODE GENERATOR - Invalid position " + pointer + " in executable image.");
            }
            //Check for collision in stack and heap.
            this.checkOverflow();
            this.executableImage[pointer] = data;
            return pointer;
        };
        executableImage.prototype.addStringHelper = function (string) {
            var pos;
            if (string.length <= 0) {
                pos = this.addToHeap("00");
            }
            //Null terminate the string.
            this.addToHeap("00");
            for (var i = string.length - 1; i >= 0; i--) {
                //Get the hexidecimal representation of each character in the string.
                //Then add it to the heap.
                var toHex = string.charCodeAt(i).toString(16);
                pos = this.addToHeap(toHex);
            }
            return pos;
        };
        executableImage.prototype.addString = function (string) {
            return this.addStringHelper(string);
        };
        executableImage.prototype.checkOverflow = function () {
            if (this.stackPointer >= this.heapPointer) {
                genErr++;
                throw new Error("CODE GENERATOR - Stack Heap Collision - Program is too long.");
            }
        };
        //Search the heap for a string.
        executableImage.prototype.searchHeap = function (data) {
            var string = "";
            for (var i = this.IMAGE_SIZE - 1; i >= this.heapPointer; i++) {
                if (this.executableImage[i] == "00") {
                    if (string == data) {
                        return i;
                    }
                }
                else {
                    string = String.fromCharCode(parseInt(this.executableImage[i], 16)) + string;
                }
            }
            return null;
        };
        executableImage.prototype.displayCode = function () {
            var code = "";
            //Traverse through the executable image and print out the generated code.
            for (var i = 0; i < this.IMAGE_SIZE; i++) {
                //Improves readability by adding a new line.
                if (i % 8 == 0 && i != 0) {
                    code += "\n";
                }
                code += this.executableImage[i] + " ";
            }
            return code;
        };
        return executableImage;
    }());
    mackintosh.executableImage = executableImage;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    //Represents the jump table.
    var jumpTable = /** @class */ (function () {
        function jumpTable() {
            this.tableEntries = new Array();
            this.curTemp = 0;
        }
        jumpTable.prototype.getCurTemp = function () {
            return this.curTemp;
        };
        jumpTable.prototype.addEntry = function (newEntry) {
            this.tableEntries.push(newEntry);
            return newEntry;
        };
        jumpTable.prototype.getNextTemp = function () {
            return "T" + this.curTemp++;
        };
        //Get a value by it's temp id.
        jumpTable.prototype.getByTemp = function (tempId) {
            for (var i = 0; i < this.tableEntries.length; i++) {
                if (this.tableEntries[i].getTemp() == tempId) {
                    return this.tableEntries[i];
                }
            }
            //If we get here, its not in the table.
            return null;
        };
        //Go back and replace temps with the correct code.
        jumpTable.prototype.backpatch = function (executableImage) {
            for (var i = 0; i < this.tableEntries.length; i++) {
                if (tempIdMatch.test(executableImage[i])) {
                    var entry = this.getByTemp(executableImage[i]);
                    executableImage.addCode(mackintosh.codeGenerator.leftPad(entry.getDistance().toString(16), 2), i);
                }
            }
        };
        return jumpTable;
    }());
    mackintosh.jumpTable = jumpTable;
    //Represents a single entry in the jump table.
    var jumpTableEntry = /** @class */ (function () {
        function jumpTableEntry(temp, distance) {
            this.temp = temp;
            this.distance = distance;
        }
        jumpTableEntry.prototype.getTemp = function () {
            return this.temp;
        };
        jumpTableEntry.prototype.setTemp = function (temp) {
            this.temp = temp;
        };
        jumpTableEntry.prototype.getDistance = function () {
            return this.distance;
        };
        jumpTableEntry.prototype.setDistance = function (distance) {
            this.distance = distance;
        };
        return jumpTableEntry;
    }());
    mackintosh.jumpTableEntry = jumpTableEntry;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    //Represents the static table and implements the codeGenTable interface.
    var staticTable = /** @class */ (function () {
        function staticTable() {
            this.tableEntries = new Array();
            this.curTemp = 0;
            this.curOffset = 0;
        }
        staticTable.prototype.getCurTemp = function () {
            return this.curTemp;
        };
        staticTable.prototype.setCurTemp = function (curTemp) {
            this.curTemp = curTemp;
        };
        staticTable.prototype.getCurOffset = function () {
            return this.curOffset;
        };
        staticTable.prototype.setCurOffset = function (curOffset) {
            this.curOffset = curOffset;
        };
        //Add an entry to the static table.
        staticTable.prototype.addEntry = function (entry) {
            this.tableEntries.push(entry);
            return entry;
        };
        staticTable.prototype.getNextTemp = function () {
            return "T" + this.curTemp++;
        };
        staticTable.prototype.getNextOffset = function () {
            return this.curOffset++;
        };
        //Search for the entry by scope and var.
        staticTable.prototype.getByVarAndScope = function (varId, curScope) {
            for (var i = this.tableEntries.length - 1; i >= 0; i--) {
                //Check if both the scope and var are in the table.
                if (this.tableEntries[i].getId() == varId) {
                    var expectedScope = this.tableEntries[i].getCurScope().getScopePointer();
                    var actualScope = curScope.getMap().get(varId).getScopePointer();
                    if (expectedScope == actualScope) {
                        return this.tableEntries[i];
                    }
                    else {
                        var parent_1 = curScope.getParentScope();
                        while (parent_1 != null) {
                            //Reassign the expected scope pointer to the parent's scope pointer.
                            expectedScope = parent_1.getMap().get(varId).getScopePointer();
                            if (expectedScope == actualScope) {
                                return this.tableEntries[i];
                            }
                            //Go up to the next parent.
                            parent_1 = parent_1.getParentScope();
                        }
                    }
                }
            }
            //If we get here, then its not there.
            return null;
        };
        //Get by temp id.
        staticTable.prototype.getByTemp = function (tempId) {
            for (var i = 0; i < this.tableEntries.length; i++) {
                //Search for the entry that matches the temp id.
                if (this.tableEntries[i].getTemp() == tempId) {
                    return this.tableEntries[i];
                }
            }
            //If we get here, that means there was no match.
            return null;
        };
        staticTable.prototype.backpatch = function (executableImage) {
            //Go back and replace all of the temp data points with the correct data.
            for (var i = 0; i < this.tableEntries.length; i++) {
                if (tempIdMatch.test(executableImage[i])) {
                    var entry = this.getByTemp(executableImage[i]);
                    executableImage.addCode(mackintosh.codeGenerator.leftPad((entry.getOffset() + executableImage.getStackPointer() + 1).toString(16), 2), i);
                    executableImage.addCode('00', i + 1);
                }
            }
        };
        return staticTable;
    }());
    mackintosh.staticTable = staticTable;
    //Represents an entry in the static table.
    var staticTableEntry = /** @class */ (function () {
        function staticTableEntry(temp, id, offset, curScope) {
            this.temp = temp;
            this.id = id;
            this.offset = offset;
            this.curScope = curScope;
        }
        staticTableEntry.prototype.getTemp = function () {
            return this.temp;
        };
        staticTableEntry.prototype.setTemp = function (temp) {
            this.temp = temp;
        };
        staticTableEntry.prototype.getId = function () {
            return this.id;
        };
        staticTableEntry.prototype.setId = function (id) {
            this.id = id;
        };
        staticTableEntry.prototype.getOffset = function () {
            return this.offset;
        };
        staticTableEntry.prototype.setOffset = function (offset) {
            this.offset = offset;
        };
        staticTableEntry.prototype.getCurScope = function () {
            return this.curScope;
        };
        staticTableEntry.prototype.setCurScope = function (curScope) {
            this.curScope = curScope;
        };
        return staticTableEntry;
    }());
    mackintosh.staticTableEntry = staticTableEntry;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    var lex = /** @class */ (function () {
        function lex() {
        }
        //Populate program array.
        lex.populateProgram = function (input) {
            //Clear program if it is already populated.
            program = [];
            _Functions.log('LEXER - Lexing Program ' + programCount);
            //Push characters in string to the program array.
            for (var i = 0; i < input.length; i++) {
                program.push(input.charAt(i));
            }
        };
        //inputtedCode : string
        lex.lex = function () {
            //Loop through the length of the inputted string, and check each character.
            var curToken = new mackintosh.token();
            var tokenStream = new Array('');
            tokenStream.pop();
            for (var i = 0; i < program.length; i++) {
                tokenFlag = curToken.GenerateToken(program[i], program, i);
                //Update the pointer and remove commented code.
                if (curToken.getIsComment()) {
                    var end = curToken.updateIndex();
                    program.slice(i, end);
                    i = end;
                    curToken.setIsComment(false);
                }
                //Update the pointer after finding boolop.
                if (curToken.getBoolOp()) {
                    var end2 = curToken.updateIndex();
                    program.slice(i, end2);
                    i = end2;
                    curToken.setBoolOp(false);
                }
                //Update the pointer after a keyword is found.
                for (var j = 0; j < keywords.length; j++) {
                    if (curToken.getTokenValue().toLowerCase() === keywords[j]) {
                        var end3 = curToken.updateIndex();
                        program.slice(i, end3);
                        i = end3;
                    }
                }
                if (tokenFlag) {
                    if (curToken.getTokenCode() != "") {
                        //Add current token to the token stream.
                        tokenIndex++;
                        _Functions.log('LEXER - ' + curToken.getTokenCode() + ' Found on line: ' + lineNum);
                        tokenStream.push(curToken.getTokenValue());
                    }
                }
                else {
                    _Functions.log('LEXER ERROR - Invalid Token ' + program[i] + ' Found on line: ' + lineNum);
                    errCount++;
                }
                curToken.setIsToken(false);
                //Check for EOP $ and start lexing next program.
                if (program[i] == '$') {
                    if (errCount == 0) {
                        _Functions.log('LEXER - Lex Completed With ' + errCount + ' Errors and ' + warnCount + ' Warnings');
                        var isParsed = _Parser.parse(tokenStream);
                        var isSemantic = void 0;
                        var isGen = void 0;
                        if (isParsed) {
                            isSemantic = _SemanticAnalyzer.semanticAnalysis();
                        }
                        else {
                            _Functions.log("PARSER - Semantic analysis skipped due to parse errors.");
                        }
                        if (isSemantic) {
                            isGen = _CodeGenerator.codeGeneration();
                        }
                        else {
                            _Functions.log("SEMANTIC ANALYSIS - Code generation skipped due to semantic errors.");
                        }
                        //Check if this is the end of the program. If not, begin lexing the next program.
                        if (typeof program[i] != undefined) {
                            _Functions.log('\n');
                            _Functions.log('\n');
                            tokenStream = [];
                            _Functions.log('LEXER - Lexing Program ' + programCount);
                        }
                    }
                    else {
                        _Functions.log('LEXER - Lex Failed With ' + errCount + ' Errors and ' + warnCount + ' Warnings');
                    }
                }
            }
        };
        return lex;
    }());
    mackintosh.lex = lex;
})(mackintosh || (mackintosh = {}));
//Class that represents a single token in the lex token stream.
/*
Regular expressions must be made to test inputted strings.
Tokens needed:
Keywords: print(), while, if, int, string, boolean, false, true.
Symbols: Comments, { }, ( ), ==, !=, =, $, ''
    If a character is in '', its a char/string. If it is not, it is a id.
Characters: a, b, c, space, etc.
Digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.
Identifiers:
*/
var mackintosh;
(function (mackintosh) {
    var token = /** @class */ (function () {
        function token() {
            this.tokenCode = "";
            this.tokenValue = "";
            this.isKeyword = false;
            this.quoteCount = 0;
            this.isBoolOp = false;
        }
        token.prototype.setTokenCode = function (code) {
            this.tokenCode = code;
        };
        token.prototype.getTokenCode = function () {
            return this.tokenCode;
        };
        token.prototype.setTokenValue = function (value) {
            this.tokenValue = value;
        };
        token.prototype.getTokenValue = function () {
            return this.tokenValue;
        };
        //Updates program array index if a comment is found.
        token.prototype.updateIndex = function () {
            return this.index;
        };
        token.prototype.setIsToken = function (isToken) {
            this.isToken = isToken;
        };
        token.prototype.setBoolOp = function (isBoolOp) {
            this.isBoolOp = isBoolOp;
        };
        token.prototype.getBoolOp = function () {
            return this.isBoolOp;
        };
        token.prototype.setIsComment = function (isComment) {
            this.isComment = isComment;
        };
        token.prototype.getIsComment = function () {
            return this.isComment;
        };
        token.prototype.setTokenType = function (tokenType) {
            this.tokenType = tokenType;
        };
        token.prototype.getTokenType = function () {
            return this.tokenType;
        };
        /**
         * Generates token by checking against the regular expressions generated.
         */
        token.prototype.GenerateToken = function (input, program, counter) {
            /**
             * Use switch statements to check against each RegEx.
             */
            switch (newLine.test(input)) {
                case true:
                    this.setTokenCode("");
                    this.setTokenValue("");
                    this.isToken = true;
                    //New line causes lex error in string.
                    if (this.quoteCount > 0) {
                        _Functions.log("LEXER ERROR at " + lineNum + ": new line not allowed in string.");
                        errCount++;
                    }
                    lineNum++;
                    break;
            }
            switch (whitespace.test(input)) {
                case true:
                    this.setTokenCode("");
                    this.setTokenValue("");
                    this.isToken = true;
                    if (this.quoteCount != 0) {
                        this.setTokenCode("SPACE");
                        this.setTokenValue(" ");
                    }
                    break;
            }
            switch (digits.test(input)) {
                case true:
                    this.setTokenValue(input);
                    this.setTokenCode("DIGIT - " + input);
                    this.isToken = true;
                    //Handles digits not being allowed in strings.
                    if (this.quoteCount >= 1) {
                        _Functions.log("LEXER ERROR at " + lineNum + " - Digits cannot be in a string.");
                        this.setTokenValue("");
                        this.setTokenCode("");
                        this.isToken = false;
                    }
                    break;
            }
            switch (assignment.test(input)) {
                case true:
                    counter++;
                    //Check if the next token is a ==. If not, set token value to be assignment op.
                    if (assignment.test(program[counter])) {
                        input += program[counter];
                        switch (boolOperator.test(input)) {
                            case true:
                                this.setTokenValue(input);
                                this.setTokenCode("BOOLEAN CHECK EQUAL " + input);
                                this.isToken = true;
                                this.index = counter;
                                this.setBoolOp(true);
                                break;
                        }
                    }
                    else {
                        counter--;
                        this.setTokenValue(input);
                        this.setTokenCode("ASSIGNMENT OPERATOR - " + input);
                        this.isToken = true;
                    }
                    break;
            }
            switch (input == '!') {
                case true:
                    counter++;
                    //Check if the next token is a =. If not, report invalid token error.
                    if (assignment.test(program[counter])) {
                        //Add the next character to the token.
                        input += program[counter];
                        switch (boolOperator.test(input)) {
                            case true:
                                this.setTokenValue(input);
                                this.setTokenCode("BOOLEAN CHECK NOT EQUAL" + input);
                                this.isToken = true;
                                this.index = counter;
                                this.setBoolOp(true);
                                break;
                        }
                    }
                    else {
                        counter--;
                        this.isToken = false;
                    }
                    break;
            }
            switch (quotes.test(input)) {
                case true:
                    this.setTokenValue(input);
                    this.isToken = true;
                    this.quoteCount++;
                    if (this.quoteCount == 1) {
                        this.setTokenCode("OPEN QUOTES " + input);
                    }
                    else if (this.quoteCount == 2) {
                        this.setTokenCode("CLOSED QUOTES " + input);
                        this.quoteCount = 0;
                    }
                    break;
            }
            switch (characters.test(input)) {
                case true:
                    var saveChar = new Array('');
                    var loops = 0;
                    var isntKey = false;
                    saveChar.pop();
                    saveChar.push(input);
                    //Checks if the next element in the array is undefined. If this isn't here the program gets stuck in an
                    //infinate loop, and thats bad.
                    while (this.isKeyword != true && loops <= 7) {
                        if (typeof program[counter + 1] != undefined) {
                            counter++;
                            input += program[counter];
                            switch (intRegEx.test(input)) {
                                case true:
                                    if (input == "int") {
                                        this.setTokenValue(input);
                                        this.setTokenCode("KEYWORD VAR DECLARATION " + input);
                                        this.isKeyword = true;
                                        this.isToken = true;
                                        this.index = counter;
                                    }
                                    else {
                                        isntKey = true;
                                    }
                                    break;
                            }
                            switch (stringRegEx.test(input)) {
                                case true:
                                    if (input == "string") {
                                        this.setTokenValue(input);
                                        this.setTokenCode("KEYWORD VAR DECLARATION " + input);
                                        this.isKeyword = true;
                                        this.isToken = true;
                                        this.index = counter;
                                    }
                                    else {
                                        isntKey = true;
                                    }
                                    break;
                            }
                            switch (printRegEx.test(input)) {
                                case true:
                                    if (input == "print") {
                                        this.setTokenValue(input);
                                        this.setTokenCode("KEYWORD PRINT STATEMENT " + input);
                                        this.isKeyword = true;
                                        this.isToken = true;
                                        this.index = counter;
                                    }
                                    else {
                                        isntKey = true;
                                    }
                                    break;
                            }
                            switch (trueRegEx.test(input)) {
                                case true:
                                    if (input == "true") {
                                        this.setTokenValue(input);
                                        this.setTokenCode("BOOLEAN " + input);
                                        this.isKeyword = true;
                                        this.isToken = true;
                                        this.index = counter;
                                    }
                                    else {
                                        isntKey = true;
                                    }
                                    break;
                            }
                            switch (falseRegEx.test(input)) {
                                case true:
                                    if (input == "false") {
                                        this.setTokenValue(input);
                                        this.setTokenCode("BOOLEAN " + input);
                                        this.isKeyword = true;
                                        this.isToken = true;
                                        this.index = counter;
                                    }
                                    else {
                                        isntKey = true;
                                    }
                                    break;
                            }
                            switch (ifRegEx.test(input)) {
                                case true:
                                    if (input == "if") {
                                        this.setTokenValue(input);
                                        this.setTokenCode("BRANCHING STATEMENT " + input);
                                        this.isKeyword = true;
                                        this.isToken = true;
                                        this.index = counter;
                                    }
                                    else {
                                        isntKey = true;
                                    }
                                    break;
                            }
                            switch (whileRegEx.test(input)) {
                                case true:
                                    if (input == "while") {
                                        this.setTokenValue(input);
                                        this.setTokenCode("WHILE KEYWORD " + input);
                                        this.isKeyword = true;
                                        this.isToken = true;
                                        this.index = counter;
                                    }
                                    else {
                                        isntKey = true;
                                    }
                                    break;
                            }
                            switch (boolRegEx.test(input)) {
                                case true:
                                    if (input == "boolean") {
                                        this.setTokenValue(input);
                                        this.setTokenCode("BOOLEAN KEYWORD " + input);
                                        this.isKeyword = true;
                                        this.isToken = true;
                                        this.index = counter;
                                    }
                                    else {
                                        isntKey = true;
                                    }
                                    break;
                            }
                            //Break out of the loop if the token is a keyword it has become too long to be a token.
                            //Or, break out of the loop if the next element in the array is undefined.
                            if (typeof program[counter + 1] === 'undefined' || this.isKeyword == true || isntKey == true) {
                                break;
                            }
                            loops++;
                        }
                        //Break out of the loop if the next element is undefined.
                        else {
                            break;
                        }
                    }
                    if (this.isKeyword == false) {
                        input = saveChar[0].toString();
                    }
                    if (this.quoteCount > 0) {
                        this.setTokenCode("CHARACTER " + saveChar[0]);
                        this.setTokenValue(saveChar[0].toString());
                        this.isToken = true;
                    }
                    else if (this.quoteCount == 0 && this.isKeyword == false) {
                        this.setTokenCode("IDENTIFIER " + saveChar[0].toString());
                        this.setTokenValue(saveChar[0].toString());
                        this.isToken = true;
                    }
                    this.isKeyword = false;
                    isntKey = false;
                    break;
            }
            switch (operator.test(input)) {
                case true:
                    this.setTokenValue(input);
                    this.setTokenCode("ADDITION OPERATOR " + input);
                    this.isToken = true;
                    break;
            }
            switch (leftBlock.test(input)) {
                case true:
                    this.setTokenValue(input);
                    this.setTokenCode("OPENING CODE BLOCK " + input);
                    this.isToken = true;
                    break;
            }
            switch (rightBlock.test(input)) {
                case true:
                    this.setTokenValue(input);
                    this.setTokenCode("CLOSING CODE BLOCK " + input);
                    this.isToken = true;
                    break;
            }
            switch (endProgram.test(input)) {
                case true:
                    this.setTokenValue(input);
                    this.setTokenCode("END PROGRAM " + input);
                    programCount++;
                    this.isToken = true;
                    break;
            }
            switch (openComments.test(input)) {
                case true:
                    this.isToken = true;
                    var comment = new Array("");
                    this.setTokenCode("");
                    comment.pop();
                    comment.push(program[counter]);
                    counter++;
                    comment.push(program[counter]);
                    counter++;
                    //This is kind of a dumb fix but it works.
                    var closeComment = false;
                    this.setIsComment(true);
                    while (closeComment == false) {
                        comment.push(program[counter]);
                        counter++;
                        closeComment = closeComments.test(program[counter]);
                        this.index = counter;
                    }
                    comment.push(program[counter]);
                    counter++;
                    comment.push(program[counter]);
                    this.index = counter;
            }
            switch (input === '(') {
                case true:
                    this.setTokenValue(input);
                    this.setTokenCode("OPEN PARENTHESIS " + input);
                    this.isToken = true;
                    break;
            }
            switch (input === ')') {
                case true:
                    this.setTokenValue(input);
                    this.setTokenCode("CLOSE PARENTHESIS " + input);
                    this.isToken = true;
                    break;
            }
            if (this.isToken == false) {
                this.setTokenCode("ERROR - INVALID TOKEN " + input);
            }
            return this.isToken;
        };
        return token;
    }());
    mackintosh.token = token;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    //Code reference: JavaScript tree demo: https://www.labouseur.com/projects/jsTreeDemo/treeDemo.js
    //Class to represent a node in the tree.
    var CSTNode = /** @class */ (function () {
        function CSTNode(nodeName) {
            this.nodeName = nodeName;
            this.children = [];
        }
        CSTNode.prototype.setNodeName = function (nodeName) {
            this.nodeName = nodeName;
        };
        CSTNode.prototype.getNodeName = function () {
            return this.nodeName;
        };
        CSTNode.prototype.getChildren = function () {
            return this.children;
        };
        CSTNode.prototype.addChildren = function (child) {
            this.children.push(child);
        };
        CSTNode.prototype.getParent = function () {
            return this.parent;
        };
        CSTNode.prototype.setParent = function (parNode) {
            this.parent = parNode;
        };
        return CSTNode;
    }());
    mackintosh.CSTNode = CSTNode;
    //Class to represent CST.
    var CST = /** @class */ (function () {
        function CST() {
            this.rootNode = null;
        }
        CST.prototype.getRoot = function () {
            return this.rootNode;
        };
        CST.prototype.getCurNode = function () {
            return this.curNode;
        };
        //Kind represents if the node is a leaf or a branch node.
        CST.prototype.addNode = function (nodeName, kind) {
            //Create a node object. Has a name, child nodes, parent nodes, and if its a leaf or branch node.
            var node = new CSTNode(nodeName);
            //Check if theres a root node. If not, make the current node the root node.
            if (this.rootNode == null) {
                this.rootNode = node;
            }
            //The current node is a child node.
            else {
                node.setParent(this.curNode);
                this.curNode.addChildren(node);
            }
            //Check what kind of node this node is. Branch nodes are the grammar names (block, statement, etc.) and leaf nodes
            //are the tokens.
            if (kind == "branch") {
                this.curNode = node;
            }
        };
        CST.prototype.climbTree = function () {
            //Move up the tree to the parent node if it exists.
            if (this.curNode.getParent() !== null && this.curNode.getParent().getNodeName() !== undefined) {
                this.curNode = this.curNode.getParent();
            }
            else {
                _Functions.log("CST ERROR - Parent node does not exist.");
            }
        };
        CST.prototype.toString = function () {
            var treeString = "";
            //Handles the expansion of nodes using recursion.
            function expand(node, depth) {
                //Format to show the depth of the tree when displaying.
                for (var i = 0; i < depth; i++) {
                    treeString += "-";
                }
                //Check if the node is a leaf node. Then add the node and skip to new line.
                if (node.getChildren().length === 0) {
                    treeString += "[" + node.getNodeName() + "] \n";
                }
                //Get and display the children.
                else {
                    treeString += "<" + node.getNodeName() + "> \n";
                    for (var i = 0; i < node.getChildren().length; i++) {
                        expand(node.getChildren()[i], depth + 1);
                    }
                }
            }
            //Call and expand from the root node.
            expand(this.rootNode, 0);
            return treeString;
        };
        return CST;
    }());
    mackintosh.CST = CST;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    //Class that represents parse/
    var parse = /** @class */ (function () {
        function parse() {
        }
        //Recursive descent parser implimentation.
        parse.parse = function (parseTokens) {
            var isParsed = false;
            CSTTree = new mackintosh.CST();
            ASTTree = new mackintosh.CST();
            tokenPointer = 0;
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("PARSER - Parsing Program " + (programCount - 1));
            //Check if there are tokens in the token stream.
            if (parseTokens.length == 0) {
                _Functions.log("PARSER ERROR - There are no tokens to be parsed.");
                parseErrCount++;
            }
            //Begin parse.
            else {
                //Use try catch to check for parse failures and output them.
                try {
                    this.parseProgram(parseTokens);
                    _Functions.log("PARSER - Parse completed with " + parseErrCount + " errors and " +
                        parseWarnCount + " warnings");
                    //Prints the CST if there are no more errors.
                    if (parseErrCount <= 0) {
                        isParsed = true;
                        _Functions.log("\n");
                        _Functions.log("\n");
                        _Functions.log("PARSER - Program " + (programCount - 1) + " CST:");
                        _Functions.log(CSTTree.toString());
                        _Functions.log("\n");
                        _Functions.log("\n");
                        _Functions.log("PARSER - Program " + (programCount - 1) + " AST:");
                        _Functions.log(ASTTree.toString());
                    }
                    else {
                        isParsed = false;
                        _Functions.log("\n");
                        _Functions.log("\n");
                        _Functions.log("PARSER - CST and AST not displayed due to parse errors.");
                    }
                }
                catch (error) {
                    _Functions.log(error);
                    _Functions.log("PARSER - Error caused parse to end.");
                    parseErrCount++;
                }
            }
            return isParsed;
        };
        //Match function.
        parse.match = function (expectedTokens, parseToken, isString) {
            //Check if the token is in a the expected token array.
            for (var i = 0; i < expectedTokens.length; i++) {
                if (expectedTokens[i] == parseToken) {
                    isMatch = true;
                }
            }
            if (isString) {
                for (var i = 0; i < expectedTokens.length; i++) {
                    if (expectedTokens[i] == parseToken.charAt(i)) {
                        isMatch = true;
                    }
                }
            }
            if (isMatch) {
                _Functions.log("PARSER - Token Matched! " + parseToken);
                CSTTree.addNode(parseToken, "leaf");
                //Don't increment the token pointer if its a string, its already where it needs to be.
                if (!isString) {
                    tokenPointer++;
                }
                isMatch = false;
                //Add AST Node.
                if (isASTNode) {
                    ASTTree.addNode(parseToken, "leaf");
                }
                isASTNode = false;
            }
            else {
                _Functions.log("PARSER ERROR - Expected tokens (" + expectedTokens.toString() + ") but got "
                    + parseToken + " instead.");
                parseErrCount++;
            }
        };
        //Methods for recursive descent parser - Start symbol: program.
        //Expected tokens - block, $
        parse.parseProgram = function (parseTokens) {
            _Functions.log("PARSER - parseProgram()");
            //Add the program node to the tree. This should be the root node.
            CSTTree.addNode("Program", "branch");
            //Begin parse block.
            this.parseBlock(parseTokens);
            //Check for EOP at the end of program.
            if (parseTokens[tokenPointer] == "$") {
                this.match(["$"], parseTokens[tokenPointer], false);
                _Functions.log("PARSER - Program successfully parsed.");
            }
            else if (parseTokens[tokenPointer + 1] == undefined) {
                _Functions.log("PARSER ERROR - EOP $ not found at end of program.");
                parseErrCount++;
            }
        };
        //Expected tokens: { statementList }
        parse.parseBlock = function (parseTokens) {
            _Functions.log("PARSER - parseBlock()");
            CSTTree.addNode("Block", "branch");
            ASTTree.addNode("Block", "branch");
            this.parseOpenBrace(parseTokens);
            this.parseStatementList(parseTokens);
            this.parseCloseBrace(parseTokens);
            CSTTree.climbTree();
        };
        //Expected tokens: statement statementList
        //OR - empty
        parse.parseStatementList = function (parseTokens) {
            //Check if the token is empty or not.
            _Functions.log("PARSER - parseStatementList()");
            CSTTree.addNode("StatementList", "branch");
            while (parseTokens[tokenPointer] != "}") {
                _Functions.log("PARSER - parseStatement()");
                CSTTree.addNode("Statement", "branch");
                //this.parseStatement(parseTokens);
                //Use regular expressions from lex to check what type of statement is to be parsed.
                if (printRegEx.test(parseTokens[tokenPointer])) {
                    this.parsePrintStatement(parseTokens);
                }
                //Check for assignment op.
                else if (assignment.test(parseTokens[tokenPointer + 1])) {
                    this.parseAssignmentStatement(parseTokens);
                }
                //Check for var declaration types - boolean, int, string.
                else if (boolRegEx.test(parseTokens[tokenPointer]) || stringRegEx.test(parseTokens[tokenPointer])
                    || intRegEx.test(parseTokens[tokenPointer])) {
                    this.parseVarDecl(parseTokens);
                }
                //Check for while statement.
                else if (whileRegEx.test(parseTokens[tokenPointer])) {
                    this.parseWhileStatement(parseTokens);
                }
                //Check for if statement.
                else if (ifRegEx.test(parseTokens[tokenPointer])) {
                    this.parseIfStatement(parseTokens);
                }
                //Check for opening or closing block.
                else if (leftBlock.test(parseTokens[tokenPointer])) {
                    this.parseBlock(parseTokens);
                }
                else {
                    _Functions.log("PARSER ERROR - Expected beginning of statement tokens"
                        + "(if, print, while, {}, assignment statement, boolean, int, string)");
                    parseErrCount++;
                    break;
                }
                CSTTree.climbTree();
            }
            CSTTree.climbTree();
        };
        //Expected tokens: print( expr )
        parse.parsePrintStatement = function (parseTokens) {
            _Functions.log("PARSER - parsePrintStatement()");
            CSTTree.addNode("PrintStatement", "branch");
            ASTTree.addNode("PrintStatement", "branch");
            this.parsePrint(parseTokens);
            this.parseParen(parseTokens);
            this.parseExpr(parseTokens);
            this.parseParen(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        };
        //Expected tokens: id = exprx
        parse.parseAssignmentStatement = function (parseTokens) {
            _Functions.log("PARSER - parseAssignmentStatement()");
            CSTTree.addNode("AssignmentStatement", "branch");
            ASTTree.addNode("AssignmentStatement", "branch");
            this.parseId(parseTokens);
            this.parseAssignmentOp(parseTokens);
            this.parseExpr(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        };
        //Expected tokens: type id
        parse.parseVarDecl = function (parseTokens) {
            _Functions.log("PARSER - parseVarDecl()");
            CSTTree.addNode("VarDecl", "branch");
            ASTTree.addNode("VarDecl", "branch");
            this.parseType(parseTokens);
            this.parseId(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        };
        //Expected tokens: while boolexpr block
        parse.parseWhileStatement = function (parseTokens) {
            _Functions.log("PARSER - parseWhileStatement()");
            CSTTree.addNode("WhileStatement", "branch");
            ASTTree.addNode("WhileStatement", "branch");
            this.parseWhile(parseTokens);
            this.parseBoolExpr(parseTokens);
            this.parseBlock(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        };
        //Expected tokens: if boolexpr block
        parse.parseIfStatement = function (parseTokens) {
            _Functions.log("PARSER - parseIfStatement()");
            CSTTree.addNode("IfStatement", "branch");
            ASTTree.addNode("WhileStatement", "branch");
            this.parseIf(parseTokens);
            this.parseBoolExpr(parseTokens);
            this.parseBlock(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        };
        //Expected tokens: intexpr, stringexpr, boolexpr, id
        parse.parseExpr = function (parseTokens) {
            _Functions.log("PARSER - parseExpr()");
            CSTTree.addNode("Expr", "branch");
            //Check what type of expr this token is.
            if (digits.test(parseTokens[tokenPointer])) {
                this.parseIntExpr(parseTokens);
                //Handle multiple digits.
                while (digits.test(parseTokens[tokenPointer])) {
                    this.parseIntExpr(parseTokens);
                }
            }
            //String check.
            else if (quotes.test(parseTokens[tokenPointer])) {
                this.parseStringExpr(parseTokens);
            }
            //This handles if its an id.
            else if (characters.test(parseTokens[tokenPointer])) {
                if (parseTokens[tokenPointer].length > 1) {
                    if (trueRegEx.test(parseTokens[tokenPointer]) || falseRegEx.test(parseTokens[tokenPointer])) {
                        this.parseBoolExpr(parseTokens);
                    }
                }
                else {
                    this.parseId(parseTokens);
                }
            }
            //Bool expr.
            CSTTree.climbTree();
        };
        //Expected tokens: digit intop expr
        //OR: digit
        parse.parseIntExpr = function (parseTokens) {
            _Functions.log("PARSER - parseIntExpr()");
            CSTTree.addNode("IntExpr", "branch");
            //Check if this is to be an expression or a single digit.
            if (parseTokens[tokenPointer + 1] == "+") {
                this.parseDigit(parseTokens);
                this.parseIntOp(parseTokens);
                this.parseExpr(parseTokens);
            }
            else {
                this.parseDigit(parseTokens);
            }
            CSTTree.climbTree();
        };
        //Expected tokens: "charlist"
        parse.parseStringExpr = function (parseTokens) {
            _Functions.log("PARSER - parseStringExpr()");
            CSTTree.addNode("StringExpr", "branch");
            this.parseQuotes(parseTokens);
            this.parseCharList(parseTokens);
            this.parseQuotes(parseTokens);
            CSTTree.climbTree();
        };
        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        parse.parseBoolExpr = function (parseTokens) {
            _Functions.log("PARSER - parseBoolExpr()");
            CSTTree.addNode("BooleanExpr", "branch");
            //If match parenthesis = true: (expr boolop expr)
            if (parseTokens[tokenPointer] == "(" || parseTokens[tokenPointer] == ")") {
                this.parseParen(parseTokens);
                //Add AST node depending on if it is checking isEqual or isNotEqual.
                if (parseTokens[tokenPointer + 1] == "==") {
                    ASTTree.addNode("isEqual", "branch");
                }
                else if (parseTokens[tokenPointer + 1] == "!=") {
                    ASTTree.addNode("isNotEqual", "branch");
                }
                this.parseExpr(parseTokens);
                this.parseBoolOp(parseTokens);
                this.parseExpr(parseTokens);
                this.parseParen(parseTokens);
            }
            //Boolean value.
            else {
                this.parseBoolVal(parseTokens);
            }
            CSTTree.climbTree();
        };
        //Expected tokens: char
        parse.parseId = function (parseTokens) {
            _Functions.log("PARSER - parseId()");
            CSTTree.addNode("Id", "branch");
            this.parseChar(parseTokens);
            CSTTree.climbTree();
        };
        //Expected tokens: char charlist, space charlist, empty
        parse.parseCharList = function (parseTokens) {
            _Functions.log("PARSER - parseCharList()");
            CSTTree.addNode("CharList", "branch");
            if (parseTokens[tokenPointer] === " ") {
                this.parseSpace(parseTokens);
            }
            else if (characters.test(parseTokens[tokenPointer])) {
                var string = "";
                //Builds string until there is a quote.
                while (!quotes.test(parseTokens[tokenPointer])) {
                    //this.parseChar(parseTokens);
                    string += parseTokens[tokenPointer];
                    tokenPointer++;
                }
                _Functions.log("PARSER - String: " + string);
                this.parseString(parseTokens, string);
            }
            else {
                //Not an empty else, represents do nothing.
            }
            CSTTree.climbTree();
        };
        //Expected tokens: int, string, boolean
        parse.parseType = function (parseTokens) {
            isASTNode = true;
            this.match(["int", "string", "boolean"], parseTokens[tokenPointer], false);
        };
        //Expected tokens: a-z
        parse.parseChar = function (parseTokens) {
            isASTNode = true;
            this.match(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
                "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
                "y", "z"], parseTokens[tokenPointer], false);
        };
        parse.parseString = function (parseTokens, string) {
            isASTNode = true;
            this.match(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
                "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
                "y", "z"], string, true);
        };
        //Expected tokens: space
        parse.parseSpace = function (parseTokens) {
            this.match([" "], parseTokens[tokenPointer], false);
        };
        //Expected tokens: 0-9
        parse.parseDigit = function (parseTokens) {
            isASTNode = true;
            this.match(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], parseTokens[tokenPointer], false);
        };
        //Expected tokens: ==, !=
        parse.parseBoolOp = function (parseTokens) {
            this.match(["==", "!="], parseTokens[tokenPointer], false);
        };
        //Expected tokens: false, true
        parse.parseBoolVal = function (parseTokens) {
            isASTNode = true;
            this.match(["false", "true"], parseTokens[tokenPointer], false);
        };
        //Expected tokens: +
        parse.parseIntOp = function (parseTokens) {
            this.match(["+"], parseTokens[tokenPointer], false);
        };
        parse.parseParen = function (parseTokens) {
            this.match(["(", ")"], parseTokens[tokenPointer], false);
        };
        parse.parseAssignmentOp = function (parseTokens) {
            this.match(["="], parseTokens[tokenPointer], false);
        };
        parse.parseQuotes = function (parseTokens) {
            isASTNode = true;
            this.match(['"', '"'], parseTokens[tokenPointer], false);
        };
        parse.parseIf = function (parseTokens) {
            this.match(["if"], parseTokens[tokenPointer], false);
        };
        parse.parseWhile = function (parseTokens) {
            this.match(["while"], parseTokens[tokenPointer], false);
        };
        parse.parsePrint = function (parseTokens) {
            this.match(["print"], parseTokens[tokenPointer], false);
        };
        parse.parseOpenBrace = function (parseTokens) {
            this.match(["{"], parseTokens[tokenPointer], false);
        };
        parse.parseCloseBrace = function (parseTokens) {
            this.match(["}"], parseTokens[tokenPointer], false);
        };
        return parse;
    }());
    mackintosh.parse = parse;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    //Represents the values in the hash map.
    var scope = /** @class */ (function () {
        function scope(value, type, scopePointer) {
            this.isUsed = false;
            this.value = value;
            this.scopePointer = scopePointer;
            this.type = type;
        }
        scope.prototype.setIsUsed = function (isUsed) {
            this.isUsed = isUsed;
        };
        scope.prototype.getIsUsed = function () {
            return this.isUsed;
        };
        scope.prototype.getValue = function () {
            return this.value;
        };
        scope.prototype.setValue = function (value) {
            this.value = value;
        };
        scope.prototype.getType = function () {
            return this.type;
        };
        scope.prototype.setType = function (type) {
            this.type = type;
        };
        scope.prototype.getScopePointer = function () {
            return this.scopePointer;
        };
        scope.prototype.setScopePointer = function (scopePointer) {
            this.scopePointer = scopePointer;
        };
        return scope;
    }());
    mackintosh.scope = scope;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    var semanticAnalyser = /** @class */ (function () {
        function semanticAnalyser() {
        }
        semanticAnalyser.semanticAnalysis = function () {
            debugger;
            scopePointer = 0;
            symbolTable = new mackintosh.symbolTableTree();
            semErr = 0;
            semWarn = 0;
            var isSemantic = false;
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("SEMANTIC ANALYSIS - Beginning Semantic Analysis " + (programCount - 1));
            try {
                this.analyzeBlock(ASTTree.getRoot());
                //this.traverseAST();
                _Functions.log("SEMANTIC ANALYSIS - Completed Semantic Analysis " + (programCount - 1) + " with "
                    + semErr + " errors and " + semWarn + " warnings.");
                if (semErr <= 0) {
                    isSemantic = true;
                    _Functions.log("\n");
                    _Functions.log("\n");
                    _Functions.log("SEMANTIC ANALYSIS - Program " + (programCount - 1) + " Symbol Table:");
                    _Functions.log("\n");
                    _Functions.log("-------------------------------");
                    _Functions.log("Symbol        Type        Scope");
                    _Functions.log("-------------------------------");
                    _Functions.log(symbolTable.toString());
                }
                else {
                    isSemantic = false;
                    _Functions.log("\n");
                    _Functions.log("\n");
                    _Functions.log("SEMANTIC ANALYSIS - Symbol table not displayed due to semantic analysis errors.");
                }
            }
            catch (error) {
                _Functions.log(error);
                _Functions.log("SEMANTIC ANALYSIS - Ended due to error.");
            }
            return isSemantic;
        };
        /*
            Method to traverse through the AST and perform semantic analysis.
            Based on the toString method. Instead of traversing and turning it into a string, semantic analysis will be
            performed on the AST.
            AST Nodes that are added to symbol table:
            VarDecl, while statement, if statement, print statement, assignment statement, block
        */
        semanticAnalyser.analyzeBlock = function (astNode) {
            //Open up a new scope and add it to the symbol table.
            //Once the recursion ends the scope will be closed.
            scopePointer++;
            var newScope;
            newScope = new Map();
            _Functions.log("SEMANTIC ANALYSIS - Block found, opening new scope " + scopePointer);
            symbolTable.addNode(newScope);
            if (astNode.getChildren().length != 0) {
                //Use recursion to travel through the nodes.
                for (var i = 0; i < astNode.getChildren().length; i++) {
                    this.analyzeStatement(astNode.getChildren()[i]);
                }
            }
            //this.analyzeStatement(astNode.getChildren()[0]);
            _Functions.log("SEMANTIC ANALYSIS - Closing scope " + scopePointer);
            symbolTable.closeScope();
            var unusedIds = symbolTable.getCurNode().getUnusedIds();
            //Check if there are unused ids.
            if (unusedIds.length != 0) {
                _Functions.log("SEMANTIC ANALYSIS - Ids were declared but never used.");
                _Functions.log("SEMANTIC ANALYSIS - Unused ids in scope " + scopePointer + ": ");
                for (var i = 0; i < unusedIds.length; i++) {
                    _Functions.log(unusedIds[i]);
                    semWarn++;
                }
            }
            scopePointer--;
            //Add check for unused ids.
        };
        semanticAnalyser.analyzeStatement = function (astNode) {
            if (astNode.getNodeName() === "Block") {
                this.analyzeBlock(astNode);
            }
            if (astNode.getNodeName() === "VarDecl") {
                this.analyzeVarDecl(astNode);
            }
            if (astNode.getNodeName() === "PrintStatement") {
                this.analyzePrintStatement(astNode);
            }
            if (astNode.getNodeName() === "IfStatement") {
                this.analyzeIfStatement(astNode);
            }
            if (astNode.getNodeName() === "WhileStatement") {
                this.analyzeWhileStatement(astNode);
            }
            if (astNode.getNodeName() === "AssignmentStatement") {
                this.analyzeAssignmentStatement(astNode);
            }
        };
        semanticAnalyser.analyzeVarDecl = function (astNode) {
            //Add the symbol to the symbol table if it has not been declared already.
            _Functions.log("SEMANTIC ANALYSIS - VarDecl found.");
            //let map = symbolTable.getCurNode().getMap();
            var scopeType = astNode.getChildren()[0].getNodeName();
            var symbol = astNode.getChildren()[1].getNodeName();
            //This symbol has not been given a value, so it will be null for now.
            var scope = new mackintosh.scope(null, scopeType, scopePointer);
            var current = symbolTable.getCurNode();
            symbolTable.getCurNode().addSymbol(symbol, scope);
        };
        semanticAnalyser.analyzePrintStatement = function (astNode) {
            _Functions.log("SEMANTIC ANALYSIS - Print Statement found.");
            var symbol = astNode.getChildren()[0].getNodeName();
            var isSymbol;
            var printVal;
            //Check if the value in print is a symbol or just a literal.
            if (characters.test(symbol) && symbol.length == 1) {
                isSymbol = true;
            }
            else if (symbol === "true" || symbol === "false") {
                isSymbol = false;
                printVal = symbol;
            }
            else if (digits.test(symbol)) {
                isSymbol = false;
                printVal = symbol;
            }
            else if (quotes.test(symbol)) {
                isSymbol = false;
                var i = 1;
                while (!quotes.test(astNode.getChildren()[i].getNodeName())) {
                    printVal += astNode.getChildren()[i].getNodeName();
                    i++;
                }
                printVal += '"';
            }
            if (isSymbol == true) {
                //Check if the symbol to be printed is in the symbol table.
                if (symbolTable.getCurNode().lookup(symbol) != null) {
                    _Functions.log("SEMANTIC ANALYSIS - Print " + symbol);
                }
                else {
                    semErr++;
                    throw new Error("SEMANTIC ANALYSIS - Symbol " + symbol + " does not exist in symbol table.");
                }
            }
            //If the value is not a symbol see if its valid to be printed. Else, throw an error.
            else {
                if (printVal != undefined) {
                    _Functions.log("SEMANTIC ANALYSIS - Print " + printVal);
                }
                else {
                    semErr++;
                    throw new Error("SEMANTIC ANALYSIS - Value " + printVal + " cannot be printed.");
                }
            }
        };
        semanticAnalyser.analyzeIfStatement = function (astNode) {
            _Functions.log("SEMANTIC ANALYSIS - If Statement found.");
            //Check if both ends of the statement are in the symbol table
            _Functions.log("SEMANTIC ANALYSIS - While Statement found.");
            var if1 = astNode.getChildren()[0].getChildren()[0].getNodeName();
            var if2 = astNode.getChildren()[0].getChildren()[1].getNodeName();
            if (symbolTable.getCurNode().lookup(if1) != null
                && symbolTable.getCurNode().lookup(if2) != null) {
                _Functions.log("SEMANTIC ANALYSIS - If " + if1 + " " +
                    astNode.getChildren()[0].getNodeName() + " " + if2);
            }
            for (var i = 1; i < astNode.getChildren()[0].getChildren().length; i++) {
                this.analyzeStatement(astNode.getChildren()[0].getChildren()[i]);
            }
        };
        semanticAnalyser.analyzeWhileStatement = function (astNode) {
            //Check if both ends of the statement are in the symbol table
            _Functions.log("SEMANTIC ANALYSIS - While Statement found.");
            var while1 = astNode.getChildren()[0].getChildren()[0].getNodeName();
            var while2 = astNode.getChildren()[0].getChildren()[1].getNodeName();
            if (symbolTable.getCurNode().lookup(while1) != null
                && symbolTable.getCurNode().lookup(while2) != null) {
                _Functions.log("SEMANTIC ANALYSIS - While " +
                    while1 + " " + astNode.getChildren()[0].getNodeName() + " " + while2);
            }
            for (var i = 1; i < astNode.getChildren()[0].getChildren().length; i++) {
                this.analyzeStatement(astNode.getChildren()[0].getChildren()[i]);
            }
        };
        semanticAnalyser.analyzeAssignmentStatement = function (astNode) {
            _Functions.log("SEMANTIC ANALYSIS - Assignment Statement found.");
            var symbol = astNode.getChildren()[0].getNodeName();
            var value = astNode.getChildren()[1].getNodeName();
            var curSymbol = symbolTable.getCurNode().lookup(symbol);
            var expectedDataType;
            var dataType;
            var assigned = false;
            if (symbolTable.getCurNode().lookup(symbol) == null) {
                throw new Error("SEMANTIC ANALYSIS - Symbol does not exist in symbol table.");
            }
            else {
                //Check if the value is an id, int, string, or boolean.
                if (characters.test(value) && value.length == 1) {
                    var newSymbol = symbolTable.getCurNode().lookup(value);
                    //Check the type of the two ids and make sure they are assignable.
                    if (newSymbol.getType() != curSymbol.getType()) {
                        throw new Error("SEMANTIC ANALYSIS - Type Mismatch: symbol " + symbol +
                            " with type " + curSymbol.getType() + " cannot be assigned to "
                            + value + " with type " + newSymbol.getType());
                    }
                    else if (newSymbol.getValue() == null) {
                        semWarn++;
                        _Functions.log("SEMANTIC ANALYSIS - Symbol " + symbol +
                            " is being assigned to symbol " + value + " with no value.");
                        symbolTable.getCurNode().assignment(symbol, null);
                    }
                    //Assign the variable.
                    else {
                        _Functions.log("SEMANTIC ANALYSIS - Performing Assignment " + symbol
                            + " " + newSymbol.getValue());
                        symbolTable.getCurNode().assignment(symbol, newSymbol.getValue());
                        assigned = true;
                    }
                }
                else if (value === "true" || value === "false") {
                    expectedDataType = true;
                }
                else if (quotes.test(value)) {
                    var i = 2;
                    while (!quotes.test(astNode.getChildren()[i].getNodeName())) {
                        value += astNode.getChildren()[i].getNodeName();
                        i++;
                    }
                    value += '"';
                    expectedDataType = "dsadsa";
                }
                else if (digits.test(value)) {
                    expectedDataType = 1;
                }
                if (!assigned) {
                    if (intRegEx.test(curSymbol.getType())) {
                        dataType = 1;
                    }
                    else if (stringRegEx.test(curSymbol.getType())) {
                        dataType = "xcsadsa";
                    }
                    else if (boolRegEx.test(curSymbol.getType())) {
                        dataType = true;
                    }
                    if (this.checkType(expectedDataType, dataType)) {
                        _Functions.log("SEMANTIC ANALYSIS - Performing assignment " + symbol + " " + value);
                        symbolTable.getCurNode().assignment(symbol, value);
                    }
                }
            }
        };
        //Check the type or report type mismatch error.
        semanticAnalyser.checkType = function (expected, actual) {
            if (typeof expected == typeof actual) {
                return true;
            }
            else {
                throw new Error("SEMANTIC ANALYSIS - Type mismatch error expected "
                    + typeof expected + " but got " + typeof actual);
            }
        };
        return semanticAnalyser;
    }());
    mackintosh.semanticAnalyser = semanticAnalyser;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    //Represents a node in the symbol table.
    var symbolTableNode = /** @class */ (function () {
        function symbolTableNode(map) {
            this.hashmap = map;
            this.children = [];
            this.parent = null;
        }
        symbolTableNode.prototype.setMap = function (map) {
            this.hashmap = map;
        };
        symbolTableNode.prototype.getMap = function () {
            return this.hashmap;
        };
        symbolTableNode.prototype.setParentScope = function (parent) {
            this.parent = parent;
        };
        symbolTableNode.prototype.getParentScope = function () {
            return this.parent;
        };
        symbolTableNode.prototype.getChildren = function () {
            return this.children;
        };
        symbolTableNode.prototype.addChild = function (child) {
            this.children.push(child);
        };
        symbolTableNode.prototype.addSymbol = function (symbol, value) {
            if (this.hashmap.has(symbol)) {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Id has already been declared in this scope.");
            }
            else {
                this.hashmap.set(symbol, value);
            }
        };
        //Get the list of unused identifiers.
        symbolTableNode.prototype.getUnusedIds = function () {
            var unusedIds = [];
            this.hashmap.forEach(function (value, key) {
                if (!value.getIsUsed()) {
                    unusedIds.push(key);
                }
            });
            //Return the list of unused ids.
            return unusedIds;
        };
        symbolTableNode.prototype.assignment = function (symbol, value) {
            var newScope = this.lookup(symbol);
            if (newScope == null) {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Id " + symbol + " has not been identified in symbol table.");
            }
            else {
                var type = newScope.getType();
                newScope.setValue(value);
                newScope.setIsUsed(true);
                newScope.setType(type);
                this.hashmap.set(symbol, newScope);
            }
        };
        symbolTableNode.prototype.lookup = function (symbol) {
            if (this.hashmap.has(symbol)) {
                return this.hashmap.get(symbol);
            }
            //If it wasn't found and the parent isn't null check and see if its there.
            else if (this.parent !== null) {
                return this.parent.lookup(symbol);
            }
            return null;
        };
        return symbolTableNode;
    }());
    mackintosh.symbolTableNode = symbolTableNode;
    //Represent the symbol table tree.
    var symbolTableTree = /** @class */ (function () {
        function symbolTableTree() {
            this.rootNode = null;
        }
        symbolTableTree.prototype.getRoot = function () {
            return this.rootNode;
        };
        symbolTableTree.prototype.getCurNode = function () {
            return this.curNode;
        };
        symbolTableTree.prototype.addNode = function (map) {
            var node = new symbolTableNode(map);
            if (this.rootNode == null) {
                this.rootNode = node;
            }
            else {
                node.setParentScope(this.curNode);
                this.curNode.addChild(node);
            }
            this.curNode = node;
        };
        symbolTableTree.prototype.closeScope = function () {
            //Move up the tree to parent node.
            if (this.curNode.getParentScope() !== null && this.curNode.getParentScope() !== undefined) {
                this.curNode = this.curNode.getParentScope();
            }
            else if (this.curNode == this.rootNode) {
                return;
            }
            else {
                semErr++;
                throw new Error("SEMANTIC ANALYSIS - Parent scope does not exist.");
            }
        };
        symbolTableTree.prototype.toString = function () {
            var tableString = "";
            function expand(node, depth) {
                //Iterate through each key value pair and add them to the tree.
                var map = node.getMap();
                map.forEach(function (value, key) {
                    tableString += key + "            " + value.getType() +
                        "            " + value.getScopePointer() + "\n";
                });
                for (var i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren()[i], depth + 1);
                }
            }
            expand(this.rootNode, 0);
            return tableString;
        };
        symbolTableTree.prototype.getNode = function (curScope, id) {
            var foundNode;
            function expand(node, depth, id, curScope) {
                var map = node.getMap();
                map.forEach(function (value, key) {
                    if (curScope == value.getScopePointer()) {
                        foundNode = node;
                    }
                });
                for (var i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren()[i], depth + 1, id, curScope);
                }
            }
            expand(this.rootNode, 0, id, curScope);
            return foundNode;
        };
        return symbolTableTree;
    }());
    mackintosh.symbolTableTree = symbolTableTree;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=mackintosh.js.map