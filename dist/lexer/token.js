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
                                this.setTokenCode("BOOLEAN CHECK EQUAL" + input);
                                this.isToken;
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
                        //New line causes lex error in string.
                        if (input == "\n") {
                            _Functions.log("LEXER ERROR at " + lineNum + ": new line not allowed in string.");
                        }
                        else {
                            this.setTokenCode("CHARACTER " + saveChar[0]);
                            this.setTokenValue(saveChar[0].toString());
                            this.isToken = true;
                        }
                    }
                    else if (this.quoteCount == 0 && this.isKeyword == false) {
                        this.setTokenCode("IDENTIFIER " + saveChar[0].toString());
                        this.setTokenValue(saveChar[0].toString());
                        this.isToken = true;
                    }
                    this.isKeyword = false;
                    isntKey = false;
                    break;
                case false:
                    if (digits.test(input.toLowerCase())) {
                        _Functions.log("LEXER ERROR at " + lineNum + " - characters and ids cannot be capital.");
                    }
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
                    comment.pop();
                    //This is kind of a dumb fix but it works.
                    var closeComment = false;
                    var closeCommentAgain = false;
                    this.setIsComment(true);
                    while (closeComment == false || closeCommentAgain == false) {
                        comment.push(program[counter]);
                        counter++;
                        counter++;
                        closeComment = closeComments.test(program[counter]);
                        closeCommentAgain = closeComments.test(input + programCount[counter]);
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
//# sourceMappingURL=token.js.map