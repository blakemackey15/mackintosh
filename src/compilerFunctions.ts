module mackintosh {

    export class compilerFunctions {
        //Remove whitespaces.
        public static trim(srcCode : string) : string {
            //Regex to identify whitespaces and replace it with empty string.
            return srcCode.replace(/^\s+ | \s+$/g, "");
        }

        //Logs a message to the html output area. Was originally in the index.html file but I moved it here
        //so it can be used by other classes in the mackintosh module. Just makes it a bit more simple (I hope).
        public static log(message : string) {
            (<HTMLInputElement>document.getElementById("output")).value += message + " ";
        }
    }
}