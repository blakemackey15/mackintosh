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
var isInitialized = false;
var isUsed = false;
var symbolTable = new Map();
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
            debugger;
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
                debugger;
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
                        if (isParsed) {
                            //_SemanticAnalyzer.semAnalysis(tokenStream);
                        }
                        else {
                            _Functions.log("PARSER - Semantic analysis skipped due to parse errors.");
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
            debugger;
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
            debugger;
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
        parse.match = function (expectedTokens, parseToken) {
            //Check if the token is in a the expected token array.
            for (var i = 0; i < expectedTokens.length; i++) {
                if (expectedTokens[i] == parseToken) {
                    isMatch = true;
                }
            }
            if (isMatch) {
                _Functions.log("PARSER - Token Matched! " + parseToken);
                CSTTree.addNode(parseToken, "leaf");
                tokenPointer++;
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
                this.match(["$"], parseTokens[tokenPointer]);
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
                    _Functions.log("PARSER ERROR - Expected beginning of statement tokens (if, print, while, {}, assignment statement, boolean, int, string)");
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
            ASTTree.addNode("IfStatement", "branch");
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
            if (quotes.test(parseTokens[tokenPointer])) {
                this.parseStringExpr(parseTokens);
            }
            //This handles if its an id.
            if (characters.test(parseTokens[tokenPointer])) {
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
            ASTTree.addNode("IntExpr", "branch");
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
            ASTTree.climbTree();
        };
        //Expected tokens: "charlist"
        parse.parseStringExpr = function (parseTokens) {
            _Functions.log("PARSER - parseStringExpr()");
            CSTTree.addNode("StringExpr", "branch");
            ASTTree.addNode("StringExpr", "branch");
            this.parseQuotes(parseTokens);
            this.parseCharList(parseTokens);
            this.parseQuotes(parseTokens);
            CSTTree.climbTree();
            ASTTree.climbTree();
        };
        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        parse.parseBoolExpr = function (parseTokens) {
            _Functions.log("PARSER - parseBoolExpr()");
            CSTTree.addNode("BooleanExpr", "branch");
            ASTTree.addNode("BooleanExpr", "branch");
            //If match parenthesis = true: (expr boolop expr)
            if (parseTokens[tokenPointer] == "(" || parseTokens[tokenPointer] == ")") {
                this.parseParen(parseTokens);
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
            ASTTree.climbTree();
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
                var string = void 0;
                //Builds string until there is a quote.
                while (!quotes.test(parseTokens[tokenPointer])) {
                    this.parseChar(parseTokens);
                    string += parseTokens[tokenPointer];
                }
                _Functions.log("PARSER - String: " + string);
            }
            else {
                //Not an empty else, represents do nothing.
            }
            CSTTree.climbTree();
        };
        //Expected tokens: int, string, boolean
        parse.parseType = function (parseTokens) {
            isASTNode = true;
            this.match(["int", "string", "boolean"], parseTokens[tokenPointer]);
        };
        //Expected tokens: a-z
        parse.parseChar = function (parseTokens) {
            isASTNode = true;
            this.match(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
                "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x",
                "y", "z"], parseTokens[tokenPointer]);
        };
        //Expected tokens: space
        parse.parseSpace = function (parseTokens) {
            this.match([" "], parseTokens[tokenPointer]);
        };
        //Expected tokens: 0-9
        parse.parseDigit = function (parseTokens) {
            isASTNode = true;
            this.match(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], parseTokens[tokenPointer]);
        };
        //Expected tokens: ==, !=
        parse.parseBoolOp = function (parseTokens) {
            this.match(["==", "!="], parseTokens[tokenPointer]);
        };
        //Expected tokens: false, true
        parse.parseBoolVal = function (parseTokens) {
            isASTNode = true;
            this.match(["false", "true"], parseTokens[tokenPointer]);
        };
        //Expected tokens: +
        parse.parseIntOp = function (parseTokens) {
            this.match(["+"], parseTokens[tokenPointer]);
        };
        parse.parseParen = function (parseTokens) {
            this.match(["(", ")"], parseTokens[tokenPointer]);
        };
        parse.parseAssignmentOp = function (parseTokens) {
            this.match(["="], parseTokens[tokenPointer]);
        };
        parse.parseQuotes = function (parseTokens) {
            this.match(['"', '"'], parseTokens[tokenPointer]);
        };
        parse.parseIf = function (parseTokens) {
            isASTNode = true;
            this.match(["if"], parseTokens[tokenPointer]);
        };
        parse.parseWhile = function (parseTokens) {
            isASTNode = true;
            this.match(["while"], parseTokens[tokenPointer]);
        };
        parse.parsePrint = function (parseTokens) {
            this.match(["print"], parseTokens[tokenPointer]);
        };
        parse.parseOpenBrace = function (parseTokens) {
            this.match(["{"], parseTokens[tokenPointer]);
        };
        parse.parseCloseBrace = function (parseTokens) {
            this.match(["}"], parseTokens[tokenPointer]);
        };
        return parse;
    }());
    mackintosh.parse = parse;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    //Class to represent a node in the scope tree.
    var scopeTreeNode = /** @class */ (function () {
        function scopeTreeNode() {
        }
        return scopeTreeNode;
    }());
    mackintosh.scopeTreeNode = scopeTreeNode;
    //Class to represent the scope tree - tree of hash maps.
    var scopeTree = /** @class */ (function () {
        function scopeTree() {
        }
        return scopeTree;
    }());
    mackintosh.scopeTree = scopeTree;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    var semanticAnalyser = /** @class */ (function () {
        function semanticAnalyser() {
        }
        //AST and symbol table implementations.
        semanticAnalyser.semAnalysis = function (tokenStream) {
            debugger;
            //Reset gloabl variables.
            symbolTable = new Map();
            scopePointer = 0;
            isInitialized = false;
            isUsed = false;
            tokenPointer = 0;
            //Represents map values when adding new entry to symbol table.
            //Map key: symbol
            //Values order: Type, Scope, Line
            var values = new Array();
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("SEMANTIC ANALYZER - Beginning Semantic Analysis " + (programCount - 1));
            try {
                this.analyzeProgram(tokenStream);
            }
            catch (error) {
                _Functions.log("SEMANTIC ANALYZER - Semantic Analysis ended due to error.");
            }
        };
        semanticAnalyser.analyzeProgram = function (tokenStream) {
            this.analyzeBlock(tokenStream);
        };
        semanticAnalyser.analyzeBlock = function (tokenStream) {
            //A new block means new scope. Open and close scope when token pointer is equal to { or }
            scopePointer++;
            _Functions.log("SEMANTIC ANALYZER - Block found: Opening new scope " + scopePointer);
            //Call analyze statement list to check the statement within the block.
            this.analyzeStatementList(tokenStream);
            _Functions.log("SEMANTIC ANALYZER - Close block found: Closing scope" + scopePointer);
            scopePointer--;
        };
        semanticAnalyser.analyzeStatementList = function (tokenStream) {
            _Functions.log("SEMANTIC ANALYZER - analyzeStatementList()");
            while (tokenStream[tokenPointer] != "}") {
                _Functions.log("PARSER - parseStatement()");
                if (printRegEx.test(tokenStream[tokenPointer])) {
                    this.analyzePrintStatement(tokenStream);
                }
                //Check for assignment op.
                else if (assignment.test(tokenStream[tokenPointer + 1])) {
                    this.analyzeAssignmentStatement(tokenStream);
                }
                //Check for var declaration types - boolean, int, string.
                else if (boolRegEx.test(tokenStream[tokenPointer]) || stringRegEx.test(tokenStream[tokenPointer])
                    || intRegEx.test(tokenStream[tokenPointer])) {
                    this.analyzeVarDecl(tokenStream);
                }
                //Check for while statement.
                else if (whileRegEx.test(tokenStream[tokenPointer])) {
                    this.analyzeWhileStatement(tokenStream);
                }
                //Check for if statement.
                else if (ifRegEx.test(tokenStream[tokenPointer])) {
                    this.analyzeIfStatement(tokenStream);
                }
                //Check for opening or closing block.
                else if (leftBlock.test(tokenStream[tokenPointer])) {
                    this.analyzeBlock(tokenStream);
                }
            }
        };
        semanticAnalyser.analyzePrintStatement = function (tokenStream) {
            _Functions.log("PARSER - analyzePrintStatement");
        };
        semanticAnalyser.analyzeAssignmentStatement = function (tokenStream) {
            _Functions.log("PARSER - analyzeAssignmentStatement()");
        };
        semanticAnalyser.analyzeVarDecl = function (tokenStream) {
            _Functions.log("PARSER - analyzeVarDecl()");
        };
        semanticAnalyser.analyzeWhileStatement = function (tokenStream) {
            _Functions.log("PARSER - analyzeWhileStatement()");
        };
        semanticAnalyser.analyzeIfStatement = function (tokenStream) {
            _Functions.log("PARSER - analyzeIfStatement()");
        };
        return semanticAnalyser;
    }());
    mackintosh.semanticAnalyser = semanticAnalyser;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=mackintosh.js.map