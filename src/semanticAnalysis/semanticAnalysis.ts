module mackintosh {

    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    export class semanticAnalyser {
        public static semanticAnalysis() : boolean {
            scopePointer = 0;
            symbolTable = new symbolTableTree();
            semErr = 0;
            semWarn = 0;
            let isSemantic = false;
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("SEMANTIC ANALYSIS - Beginning Semantic Analysis " + (programCount - 1));

            try {
                this.analyzeBlock(ASTTree.getRoot());
                //this.traverseAST();
                _Functions.log("SEMANTIC ANALYSIS - Completed Semantic Analysis " + (programCount - 1) + " with " 
                + semErr + " errors and " + semWarn + " warnings.");

                if(semErr <= 0) {
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

            } catch (error) {
                _Functions.log(error);
                _Functions.log("SEMANTIC ANALYSIS - Ended due to error.");
            }

            return isSemantic;
        }

        /* 
            Method to traverse through the AST and perform semantic analysis.
            Based on the toString method. Instead of traversing and turning it into a string, semantic analysis will be
            performed on the AST. 
            AST Nodes that are added to symbol table:
            VarDecl, while statement, if statement, print statement, assignment statement, block
        */
        public static analyzeBlock(astNode : CSTNode) {
            //Open up a new scope and add it to the symbol table.
            //Once the recursion ends the scope will be closed.
            scopePointer++;
            let newScope : Map<any, scope>;
            newScope = new Map();
            _Functions.log("SEMANTIC ANALYSIS - Block found, opening new scope " + scopePointer);
            symbolTable.addNode(newScope);

            if(astNode.getChildren().length != 0) {
                //Use recursion to travel through the nodes.
                for(let i = 0; i < astNode.getChildren().length; i++) {
                    this.analyzeStatement(astNode.getChildren()[i]);
                }
            }

            _Functions.log("SEMANTIC ANALYSIS - Closing scope " + scopePointer);
            symbolTable.closeScope();
            let unusedIds = symbolTable.getCurNode().getUnusedIds();

            //Check if there are unused ids.
            if(unusedIds.length != 0) {
                _Functions.log("SEMANTIC ANALYSIS - Ids were declared but never used.");
                _Functions.log("SEMANTIC ANALYSIS - Unused ids in scope " + scopePointer + ": ");

                for(let i = 0; i < unusedIds.length; i++) {
                    _Functions.log(unusedIds[i] as string);
                    semWarn++;
                }
            }

            scopePointer--;
        }

        public static analyzeStatement(astNode : CSTNode) {
            if(astNode.getNodeName() === "Block") {
                this.analyzeBlock(astNode);
            }

            if(astNode.getNodeName() === "VarDecl") {
                this.analyzeVarDecl(astNode);
            }

            if(astNode.getNodeName() === "PrintStatement") {
                this.analyzePrintStatement(astNode);
            }

            if(astNode.getNodeName() === "IfStatement") {
                this.analyzeIfStatement(astNode);
            }

            if(astNode.getNodeName() === "WhileStatement") {
                this.analyzeWhileStatement(astNode);
            }

            if(astNode.getNodeName() === "AssignmentStatement") {
                this.analyzeAssignmentStatement(astNode);
            }

        }

        public static analyzeVarDecl(astNode : CSTNode) {
            //Add the symbol to the symbol table if it has not been declared already.
            _Functions.log("SEMANTIC ANALYSIS - VarDecl found.");
            //let map = symbolTable.getCurNode().getMap();
            let scopeType = astNode.getChildren()[0].getNodeName();
            let symbol = astNode.getChildren()[1].getNodeName();
            //This symbol has not been given a value, so it will be null for now.
            let scope = new mackintosh.scope(null, scopeType, scopePointer);
            let current = symbolTable.getCurNode();
            symbolTable.getCurNode().addSymbol(symbol, scope);
        }

        public static analyzePrintStatement(astNode : CSTNode) {
            _Functions.log("SEMANTIC ANALYSIS - Print Statement found.");
            for(let i = 0; i < astNode.getChildren().length; i++) {
                let symbol = astNode.getChildren()[i].getNodeName();            ;
                let isSymbol : boolean;
                let printVal : string;
    
                //Check if the value in print is a symbol or just a literal.
                if(characters.test(symbol) && symbol.length == 1) {
                    isSymbol = true;
                }
    
                else if(symbol === "BooleanExpr") {
                    let boolVal = astNode.getChildren()[i].getChildren()[0].getNodeName();
                    if( boolVal === "true" || boolVal === "false" ) {
                        isSymbol = false;
                        printVal = astNode.getChildren()[i].getChildren()[0].getNodeName();
                    }
                }
    
                else if(digits.test(symbol)) {
                    isSymbol = false;
                    printVal = symbol;
                }
    
                else if(characters.test(symbol) && symbol.length > 1) {
                    isSymbol = false;
                    printVal = symbol;
                }
    
                if(isSymbol == true) {
                    //Check if the symbol to be printed is in the symbol table.
                    if(symbolTable.getCurNode().lookup(symbol) != null) {
                        _Functions.log("SEMANTIC ANALYSIS - Print " + symbol);
                    }
    
                    else {
                        semErr++;
                        throw new Error("SEMANTIC ANALYSIS - Symbol " + symbol + " does not exist in symbol table.");
                    }
                }
    
                //If the value is not a symbol see if its valid to be printed. Else, throw an error.
                else {
                    if(printVal != undefined) {
                        _Functions.log("SEMANTIC ANALYSIS - Print " + printVal);
                    }
    
                    else {
                        semErr++;
                        throw new Error("SEMANTIC ANALYSIS - Value " + printVal + " cannot be printed.");
                    }
                }
            }
        }

        public static analyzeIfStatement(astNode : CSTNode) {
            _Functions.log("SEMANTIC ANALYSIS - If Statement found.");
            //Check if both ends of the statement are in the symbol table
            let if1 = astNode.getChildren()[0].getChildren()[0].getNodeName();
            let if2 = astNode.getChildren()[0].getChildren()[1].getNodeName();
                                
            if(symbolTable.getCurNode().lookup(if1) != null 
            && symbolTable.getCurNode().lookup(if2) != null) {
                _Functions.log("SEMANTIC ANALYSIS - If " + if1 + " " +
                astNode.getChildren()[0].getNodeName() + " " + if2);
            }

            for(let i = 1; i < astNode.getChildren()[0].getChildren().length; i++) {
                this.analyzeStatement(astNode.getChildren()[0].getChildren()[i]);
            }
            
        }

        public static analyzeWhileStatement(astNode : CSTNode) {
            //Check if both ends of the statement are in the symbol table
            _Functions.log("SEMANTIC ANALYSIS - While Statement found.");
            let while1 = astNode.getChildren()[0].getChildren()[0].getNodeName();
            let while2;

            if(astNode.getChildren()[0].getChildren().length > 1) {
                while2 = astNode.getChildren()[0].getChildren()[1].getNodeName();
            }
            
            if(symbolTable.getCurNode().lookup(while1) != null 
            && symbolTable.getCurNode().lookup(while2) != null) {
                _Functions.log("SEMANTIC ANALYSIS - While " + 
                while1 +  " " + astNode.getChildren()[0].getNodeName() + " " + while2);
            }

            for(let i = 1; i < astNode.getChildren()[0].getChildren().length; i++) {
                this.analyzeStatement(astNode.getChildren()[0].getChildren()[i]);
            }
        }

        public static analyzeAssignmentStatement(astNode : CSTNode) {
            _Functions.log("SEMANTIC ANALYSIS - Assignment Statement found.");
            let symbol = astNode.getChildren()[0].getNodeName();
            let value = astNode.getChildren()[1].getNodeName();
            let curSymbol = symbolTable.getCurNode().lookup(symbol);
            let expectedDataType;
            let dataType;
            let assigned : boolean = false;

            if(symbolTable.getCurNode().lookup(symbol) == null) {
                throw new Error("SEMANTIC ANALYSIS - Symbol does not exist in symbol table.");
            }

            else {
                //Check if the value is an id, int, string, or boolean.
                if(characters.test(value) && value.length == 1) {
                    let newSymbol = symbolTable.getCurNode().lookup(value);

                    //Check the type of the two ids and make sure they are assignable.
                    if(newSymbol.getType() != curSymbol.getType()) {
                        throw new Error("SEMANTIC ANALYSIS - Type Mismatch: symbol " + symbol + 
                        " with type " + curSymbol.getType() as string + " cannot be assigned to " 
                        + value + " with type " + newSymbol.getType() as string)
                    }

                    else if(newSymbol.getValue() == null) {
                        semWarn++;
                        _Functions.log("SEMANTIC ANALYSIS - Symbol " + symbol + 
                        " is being assigned to symbol " + value + " with no value.");
                        symbolTable.getCurNode().assignment(symbol, null);
                    }

                    //Assign the variable.
                    else {
                        _Functions.log("SEMANTIC ANALYSIS - Performing Assignment " + symbol 
                        + " " + newSymbol.getValue() as string);
                        symbolTable.getCurNode().assignment(symbol, newSymbol.getValue());
                        assigned = true;
                    }
                }

                else if(value === "true" || value === "false") {
                    expectedDataType = true;
                }

                else if(characters.test(value) && value.length > 0) {                    
                    expectedDataType = "dsadsa"
                }

                else if(digits.test(value)) {
                    expectedDataType = 1;
                }

                if(!assigned) {
                    if(intRegEx.test(curSymbol.getType())) {
                        dataType = 1;
                    }
    
                    else if(stringRegEx.test(curSymbol.getType())) {
                        dataType = "xcsadsa"
                    }
    
                    else if(boolRegEx.test(curSymbol.getType())) {
                        dataType = true;
                    }
    
                    if(this.checkType(expectedDataType, dataType)) {
                        _Functions.log("SEMANTIC ANALYSIS - Performing assignment " + symbol + " " + value);
                        symbolTable.getCurNode().assignment(symbol, value);
                    }
                }
            }
        }

        //Check the type or report type mismatch error.
        private static checkType(expected : any, actual : any) : boolean {
            if(typeof expected == typeof actual) {
                return true
            } 
            
            else {
                throw new Error("SEMANTIC ANALYSIS - Type mismatch error expected " 
                + typeof expected + " but got " +  typeof actual);
            }
        }
    }
}