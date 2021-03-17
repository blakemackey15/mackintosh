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
//Initialize token stream, error counter, and the token index.
var tokens = new Array();
var errCount = 0;
var warnCount = 0;
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
var characters = new RegExp('^[a-zA-Z]*$');
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
            _Functions.log('LEXER - Lexing Program ' + programCount);
            //Remove white spaces.
            //Push characters in string to token stream.
            for (var i = 0; i < input.length; i++) {
                _Functions.log(input.charAt(i));
                program.push(input.charAt(i));
            }
        };
        //inputtedCode : string
        lex.lex = function () {
            //Loop through the length of the inputted string, and check each character.
            var curToken = new mackintosh.token();
            for (var i = 0; i < program.length; i++) {
                tokenFlag = curToken.GenerateToken(program[i], program, i);
                if (openComments.test(curToken.getTokenValue())) {
                    var end = curToken.updateIndex();
                    program.slice(i, end);
                    i = end;
                }
                for (var j = 0; j < keywords.length; j++) {
                    if (curToken.getTokenValue().toLowerCase() === keywords[j]) {
                        //this.token.setTokenValue(this.keywords[i]);
                        var end2 = curToken.updateIndex();
                        program.slice(i, end2);
                        i = end2;
                    }
                }
                if (tokenFlag) {
                    //Add current token to the token stream.
                    _Functions.log('LEXER - ' + curToken.getTokenCode() + ' Found on line: ' + lineNum);
                }
                else {
                    _Functions.log('LEXER ERROR - ' + curToken.getTokenCode() + ' Found on line: ' + lineNum);
                    errCount++;
                }
                //Check for EOP $ and start lexing next program.
                if (program[i] == '$') {
                    if (errCount == 0) {
                        _Functions.log('LEXER - Lex Completed With ' + errCount + ' Errors and ' + warnCount + ' Warnings');
                        //Check if this is the end of the program. If not, begin lexing the next program.
                        if (typeof program[i] != undefined) {
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
                    this.isToken == false;
                    lineNum++;
                    break;
            }
            switch (whitespace.test(input)) {
                case true:
                    this.setTokenCode("");
                    this.setTokenValue("");
                    this.isToken == false;
                    break;
            }
            switch (digits.test(input)) {
                case true:
                    this.setTokenValue(input);
                    this.setTokenCode("DIGIT - " + input);
                    this.isToken = true;
                    break;
            }
            switch (assignment.test(input)) {
                case true:
                    this.setTokenValue(input);
                    this.setTokenCode("ASSIGNMENT OPERATOR - " + input);
                    this.isToken = true;
                    break;
            }
            switch (boolOperator.test(input)) {
                case true:
                    this.setTokenValue(input);
                    this.isToken = true;
                    if (this.tokenValue === "==") {
                        this.setTokenCode("BOOLEAN CHECK EQUAL " + input);
                    }
                    else if (this.tokenValue === "!=") {
                        this.setTokenCode("BOOLEAN CHECK NOT EQUAL " + input);
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
                    saveChar.pop();
                    saveChar.push(input);
                    //Checks if the next element in the array is undefined. If this isn't here the program gets stuck in an
                    //infinate loop, and thats bad.
                    if (typeof program[counter + 1] == undefined) {
                        while (this.isKeyword != true) {
                            counter++;
                            input += program[counter];
                            switch (intRegEx.test(input)) {
                                case true:
                                    this.setTokenValue(input);
                                    this.setTokenCode("KEYWORD VAR DECLARATION " + input);
                                    this.isKeyword = true;
                                    this.isToken = true;
                                    this.index = counter;
                                    break;
                            }
                            switch (stringRegEx.test(input)) {
                                case true:
                                    this.setTokenValue(input);
                                    this.setTokenCode("KEYWORD VAR DECLARATION " + input);
                                    this.isKeyword = true;
                                    this.isToken = true;
                                    this.index = counter;
                                    break;
                            }
                            switch (printRegEx.test(input)) {
                                case true:
                                    this.setTokenValue(input);
                                    this.setTokenCode("KEYWORD PRINT STATEMENT " + input);
                                    this.isKeyword = true;
                                    this.isToken = true;
                                    this.index = counter;
                                    break;
                            }
                            switch (trueRegEx.test(input)) {
                                case true:
                                    this.setTokenValue(input);
                                    this.setTokenCode("BOOLEAN " + input);
                                    this.isKeyword = true;
                                    this.isToken = true;
                                    this.index = counter;
                                    break;
                            }
                            switch (falseRegEx.test(input)) {
                                case true:
                                    this.setTokenValue(input);
                                    this.setTokenCode("BOOLEAN " + input);
                                    this.isKeyword = true;
                                    this.isToken = true;
                                    this.index = counter;
                                    break;
                            }
                            switch (ifRegEx.test(input)) {
                                case true:
                                    this.setTokenValue(input);
                                    this.setTokenCode("BRANCHING STATEMENT " + input);
                                    this.isKeyword = true;
                                    this.isToken = true;
                                    this.index = counter;
                                    break;
                            }
                            switch (whileRegEx.test(input)) {
                                case true:
                                    this.setTokenValue(input);
                                    this.setTokenCode("WHILE KEYWORD " + input);
                                    this.isKeyword = true;
                                    this.isToken = true;
                                    this.index = counter;
                                    break;
                            }
                            switch (boolRegEx.test(input)) {
                                case true:
                                    this.setTokenValue(input);
                                    this.setTokenCode("BOOLEAN KEYWORD " + input);
                                    this.isKeyword = true;
                                    this.isToken = true;
                                    this.index = counter;
                                    break;
                            }
                            if (counter == 7 || this.isKeyword == true) {
                                break;
                            }
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
                    this.setTokenValue(input);
                    this.setTokenCode("OPEN COMMENT " + input);
                    this.isToken = true;
                    var comment = new Array("");
                    comment.pop();
                    while (closeComments.test(program[counter]) != true) {
                        comment.push(program[counter]);
                        counter++;
                        this.index = counter;
                    }
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
    var CST = /** @class */ (function () {
        function CST() {
            this.rootNode = null;
        }
        CST.prototype.getRoot = function () {
            return this.rootNode;
        };
        CST.prototype.setRoot = function (node) {
            this.rootNode = node;
        };
        //Add nodes to the tree
        CST.prototype.addNode = function (nodeVal) {
            var newNode = new mackintosh.treeNode(nodeVal);
            //Check if the node is empty. If it is, make the new node the root node.
            if (this.rootNode == null) {
                this.setRoot(newNode);
                return true;
            }
            //If the root node is not empty, add it to the correct spot in the tree.
            else {
            }
        };
        //Recursive definition of depth first traversal - needed to get the valid tokens produced by the CST.
        CST.prototype.depthFirst = function () {
            var visit = new Array();
            var curNode = this.getRoot();
            function traverse(node) {
                //Array of visited node values.
                visit.push(node.getValue());
                //Check to see if node is right or left and then traverse the corresponding one.
                if (node.LeftNode) {
                    traverse(node.LeftNode);
                }
                if (node.RightNode) {
                    traverse(node.RightNode);
                }
            }
            traverse(curNode);
            return visit;
        };
        return CST;
    }());
    mackintosh.CST = CST;
})(mackintosh || (mackintosh = {}));
var mackintosh;
(function (mackintosh) {
    //Class that represents parse/
    var parse = /** @class */ (function () {
        //Get token stream from completed lex.
        function parse(tokenStream) {
            this.parseTokens = tokenStream;
        }
        //Recursive descent parser implimentation.
        parse.prototype.parse = function () {
            //i represents the token pointer.
            for (var i = 0; i < this.parseTokens.length; i++) {
                var tokenName = this.parseTokens[i].getTokenValue();
                this.curToken = tokenName;
            }
        };
        //Match function.
        parse.prototype.match = function (token) {
            return this.isMatch;
        };
        //Methods for recursive descent parser - Start symbol: program.
        parse.prototype.parseProgram = function () {
        };
        //Expected tokens: { statementList }
        parse.prototype.parseBlock = function () {
        };
        //Expected tokens: statement statementList
        //OR - empty
        parse.prototype.parseStatementList = function () {
            // else {
            //     //Not an empty else, represents do nothing.
            // }
        };
        //Expected tokens: print, assignment, var declaration, while, if, block
        parse.prototype.parseStatement = function () {
        };
        //Expected tokens: print( expr )
        parse.prototype.parsePrintStatement = function () {
        };
        //Expected tokens: id = expr
        parse.prototype.parseAssignmentStatement = function () {
        };
        //Expected tokens: type id
        parse.prototype.parseVarDecl = function () {
        };
        //Expected tokens: while boolexpr block
        parse.prototype.parseWhileStatement = function () {
        };
        //Expected tokens: if boolexpr block
        parse.prototype.parseIfStatement = function () {
        };
        //Expected tokens: intexpr, stringexpr, boolexpr, id
        parse.prototype.parseExpr = function () {
        };
        //Expected tokens: digit intop expr
        //OR: digit
        parse.prototype.parseIntExpr = function () {
        };
        //Expected tokens: "charlist"
        parse.prototype.parseStringExpr = function () {
        };
        //Expected tokens: ( expr boolop expr)
        //OR: boolval
        parse.prototype.parseBoolExpr = function () {
        };
        //Expected tokens: char
        parse.prototype.parseId = function () {
        };
        //Expected tokens: char charlist, space charlist, empty
        parse.prototype.parseCharList = function () {
            // else {
            //     //Not an empty else, represents do nothing.
            // }
        };
        //Expected tokens: int, string, boolean
        parse.prototype.parseType = function () {
        };
        //Expected tokens: a-z, A-Z
        parse.prototype.parseChar = function () {
        };
        //Expected tokens: space
        parse.prototype.parseSpace = function () {
        };
        //Expected tokens: 0-9
        parse.prototype.parseDigit = function () {
        };
        //Expected tokens: ==, !=
        parse.prototype.parseBoolOp = function () {
        };
        //Expected tokens: false, true
        parse.prototype.parseBoolVal = function () {
        };
        //Expected tokens: +
        parse.prototype.parseIntOp = function () {
        };
        return parse;
    }());
    mackintosh.parse = parse;
})(mackintosh || (mackintosh = {}));
//Class that represents a singular node in a tree.
var mackintosh;
(function (mackintosh) {
    var treeNode = /** @class */ (function () {
        //Initialize a tree node.
        function treeNode(nodeVal) {
            this.value = nodeVal;
            this.leftNode = null;
            this.rightNode = null;
        }
        //Get and set methods for node attributes.
        treeNode.prototype.getValue = function () {
            return this.value;
        };
        treeNode.prototype.setValue = function (num) {
            this.value = num;
        };
        Object.defineProperty(treeNode.prototype, "RightNode", {
            get: function () {
                return this.rightNode;
            },
            set: function (node) {
                this.rightNode = node;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(treeNode.prototype, "LeftNode", {
            get: function () {
                return this.leftNode;
            },
            set: function (node) {
                this.leftNode = node;
            },
            enumerable: false,
            configurable: true
        });
        return treeNode;
    }());
    mackintosh.treeNode = treeNode;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=mackintosh.js.map