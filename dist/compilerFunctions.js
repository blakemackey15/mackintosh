var mackintosh;
(function (mackintosh) {
    class compilerFunctions {
        //Remove whitespaces.
        static trim(srcCode) {
            //Regex to identify whitespaces and replace it with empty string.
            return srcCode.replace(/^\s+ | \s+$/g, "");
        }
        //Logs a message to the html output area. Was originally in the index.html file but I moved it here
        //so it can be used by other classes in the mackintosh module. Just makes it a bit more simple (I hope).
        static log(message) {
            document.getElementById("output").value += message + "\n";
        }
    }
    mackintosh.compilerFunctions = compilerFunctions;
})(mackintosh || (mackintosh = {}));
//# sourceMappingURL=compilerFunctions.js.map