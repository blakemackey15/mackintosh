module mackintosh {

    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    export class semanticAnalyser {
        public static semAnalysis() {
            let symbolTable = new mackintosh.symbolTable;

            symbolTable.traverseAST(ASTTree);
        }
    }
}