module mackintosh {
    export class codeGenerator {
        public static codeGeneration() : boolean {
            let isGen = false;
            genErr = 0;
            genWarn = 0;
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("CODE GENERATOR - Beginning Code Generation " + (programCount - 1));

            try {
                
            } catch (error) {
                _Functions.log(error);
                _Functions.log("CODE GENERATOR - Code Generation ended due to error.");
            }
            return isGen;
        }
    }
}