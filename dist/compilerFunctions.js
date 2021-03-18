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
//# sourceMappingURL=compilerFunctions.js.map