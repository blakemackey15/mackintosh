module mackintosh {

    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    export class semanticAnalyser {
        public static semAnalysis() {
            try {
                let symbolTable = new mackintosh.symbolTable;
                scopePointer = 0;
                _Functions.log("SEMANTIC ANALYSIS - Beginning Semantic Analysis " + (programCount - 1));
                symbolTable.traverseAST(ASTTree, symbolTable);
            } catch (error) {
                _Functions.log(error);
                _Functions.log("SEMANTIC ANALYSIS - Ended due to error.");
            }
            //symbolTable.traverseAST(ASTTree);
        }
    }
}