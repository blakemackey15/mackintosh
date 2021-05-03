module mackintosh {

    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    export class semanticAnalyser {
        public static semanticAnalysis() {
            debugger;
            scopePointer = 0;
            symbolTable = new symbolTableTree();
            semErr = 0;
            semWarn = 0;
            let isSemantic = false;
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("SEMANTIC ANALYSIS - Beginning Semantic Analysis " + (programCount - 1));

            try {
                this.traverseAST();
                _Functions.log("SEMANTIC ANALYSIS - Completed Semantic Analysis " + (programCount - 1) + " with " 
                + semErr + " errors and " + semWarn + " warnings.");

                if(semErr <= 0) {
                    isSemantic = true;
                    _Functions.log("\n");
                    _Functions.log("\n");
                    _Functions.log("SEMANTIC ANALYSIS - Program " + (programCount - 1) + " Symbol Table:");
                    _Functions.log("\n");
                    _Functions.log("-------------------------------");
                    _Functions.log("Symbol  Type  Value  isUsed");
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
        }

        /* 
            Method to traverse through the AST and perform semantic analysis.
            Based on the toString method. Instead of traversing and turning it into a string, semantic analysis will be
            performed on the AST. 
        */

        public static traverseAST() : symbolTableTree {
            debugger;
            //Function to traverse through the AST and build the symbol table.
            function expand(node : CSTNode, depth : number) {
                //Depth first in order traversal through the array of children to get the nodes.
                /*
                    AST Nodes that are added to symbol table:
                    VarDecl, while statement, if statement, print statement, assignment statement, block
                */
                let test = node.getNodeName();
                if(node.getNodeName() === "Block") {
                    //Open up a new scope and add it to the symbol table.
                    scopePointer++;
                    let newScope : Map<any, scope>;
                    newScope = new Map();
                    _Functions.log("SEMANTIC ANALYSIS - Block found, opening new scope " + scopePointer);
                    symbolTable.addNode(newScope);
                }

                if(node.getNodeName() === "VarDecl") {
                    //Add the symbol to the symbol table if it has not been declared already.
                    _Functions.log("SEMANTIC ANALYSIS - VarDecl found.");
                    //let map = symbolTable.getCurNode().getMap();
                    let scopeType = node.getChildren()[0].getNodeName();
                    let symbol = node.getChildren()[1].getNodeName();
                    //This symbol has not been given a value, so it will be null for now.
                    let scope = new mackintosh.scope(null, scopeType);
                    let current = symbolTable.getCurNode();
                    symbolTable.getCurNode().addSymbol(symbol, scope);
                }

                if(node.getNodeName() === "AssignmentStatement") {
                    _Functions.log("SEMANTIC ANALYSIS - Assignment Statement found.");
                    let symbol = node.getChildren()[0].getNodeName();
                    let value = node.getChildren()[1].getNodeName();
                    let scope = symbolTable.getCurNode().getMap().get(symbol);
                    let dataValue;
                    let dataType;

                    //Cast the value to the corresponding data type.
                    if(digits.test(value)) {
                        dataValue = value as number;
                    }

                    else if(characters.test(value)) {
                        dataValue = value as string;
                    }

                    else if(trueRegEx.test(value) || falseRegEx.test(value)) {
                        dataValue = value as boolean;
                    }

                    let symbolExists = symbolTable.getCurNode().getMap().get(symbol);
                    //Check if the symbol is in the table.
                    if(symbolExists == null) {
                        semErr++;
                        throw new Error("SEMANTIC ANALYSIS - Symbol " + symbol + " does not exist in current scope.");
                    }

                    else {
                        let scopeType = symbolExists.getType();
                        if(intRegEx.test(scopeType)) {
                            dataType = scopeType as number;
                        }
    
                        else if(stringRegEx.test(scopeType)) {
                            dataType = scopeType as string;
                        }
    
                        else if(boolRegEx.test(scopeType) || falseRegEx.test(scopeType)) {
                            dataType = scopeType as boolean;
                        }

                        if(symbolTable.getCurNode().checkType(dataValue, dataType)) {
                            symbolTable.getCurNode().assignment(symbol, dataValue);
                        }
                    }
                }

                if(node.getNodeName() === "WhileStatement") {
                    //Check if both ends of the statement are in the symbol table
                    _Functions.log("SEMANTIC ANALYSIS - While Statement found.");
                    let assign1 = symbolTable.getCurNode().getChildren()[0].getChildren()[0];
                    let assign2 = symbolTable.getCurNode().getChildren()[0].getChildren()[1];

                    if(symbolTable.getCurNode().lookup(assign1) != null 
                    && symbolTable.getCurNode().lookup(assign2) != null) {
                        _Functions.log("SEMANTIC ANALYSIS - While " + 
                        assign1 + symbolTable.getCurNode().getChildren()[0] + assign2);
                    }
                }

                if(node.getNodeName() === "IfStatement") {
                    _Functions.log("SEMANTIC ANALYSIS - If Statement found.");
                    //Check if both ends of the statement are in the symbol table
                    _Functions.log("SEMANTIC ANALYSIS - While Statement found.");
                    let if1 = symbolTable.getCurNode().getChildren()[0].getChildren()[0];
                    let if2 = symbolTable.getCurNode().getChildren()[0].getChildren()[1];
                                        
                    if(symbolTable.getCurNode().lookup(if1) != null 
                    && symbolTable.getCurNode().lookup(if2) != null) {
                        _Functions.log("SEMANTIC ANALYSIS - While " + if1 + 
                        symbolTable.getCurNode().getChildren()[0] + if2);
                    }
                }

                if(node.getNodeName() === "PrintStatement") {
                    _Functions.log("SEMANTIC ANALYSIS - Print Statement found.");
                    let symbol = node.getChildren()[0].getNodeName();
                    //Check if the symbol to be printed is in the symbol table.
                    if(symbolTable.getCurNode().lookup(symbol) != null) {
                        _Functions.log("SEMANTIC ANALYSIS - Print " + symbol);
                    }

                    else {
                        semErr++;
                        throw new Error("SEMANTIC ANALYSIS - Symbol " + symbol + " does not exist in symbol table")
                    }
                }

                for(let i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren()[i], depth + 1);
                }
            }

            let test = ASTTree.getRoot();
            expand(ASTTree.getRoot(), 0);
            return symbolTable;
        }

        //Method to go through the symbol table and find unused ids.
        public static findUnusedIds() {
            let unusedIds = [];
            function expand(node : symbolTableNode, depth : number) {

                for(let i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren()[i], depth + 1);
                }
            }

            expand(symbolTable.getRoot(), 0);
        }
    }
}