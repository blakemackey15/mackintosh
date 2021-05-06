var mackintosh;
(function (mackintosh) {
    var codeGenerator = /** @class */ (function () {
        function codeGenerator() {
        }
        codeGenerator.codeGeneration = function () {
            var isGen = false;
            genErr = 0;
            genWarn = 0;
            _Functions.log("\n");
            _Functions.log("\n");
            _Functions.log("CODE GENERATOR - Beginning Code Generation " + (programCount - 1));
            try {
            }
            catch (error) {
                _Functions.log(error);
                _Functions.log("CODE GENERATOR - Code Generation ended due to error.");
            }
            return isGen;
        };
        return codeGenerator;
    }());
    mackintosh.codeGenerator = codeGenerator;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=codeGenerator.js.map