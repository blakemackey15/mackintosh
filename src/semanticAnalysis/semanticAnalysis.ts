module mackintosh {

    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    export class semanticAnalyser {
        public static semAnalysis() {
            try {
                let symbolTable = new mackintosh.symbolTable;
                scopePointer = 0;
                _Functions.log("SEMANTIC ANALYSIS - Beginning Semantic Analysis " + (programCount - 1));
                this.semProgram(symbolTable, symbolTable.getRootScope(), ASTTree.getRoot());
            } catch (error) {
                _Functions.log(error);
                _Functions.log("SEMANTIC ANALYSIS - Ended due to error.");
            }
            //symbolTable.traverseAST(ASTTree);
        }

        //Begin semantic analysis methods.
        public static semProgram(symbolTable : symbolTable, node : symbolTableNode, astNode : CSTNode) {
            this.semBlock(symbolTable, node, astNode);
        }

        public static semBlock(symbolTable : symbolTable, node : symbolTableNode, astNode : CSTNode) {
            scopePointer++;
            _Functions.log("SEMANTIC ANALYSIS - Opening new scope: " + scopePointer);
            //Close the scope when recursion is over.
            _Functions.log("SEMANTIC ANALYSIS - Closing scope: " + scopePointer);
            symbolTable.closeScope();
        }
    }
}