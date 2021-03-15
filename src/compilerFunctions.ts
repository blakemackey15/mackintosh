module mackintosh {

    export class compilerFunctions {
        //Remove whitespaces.
        public static trim(srcCode : string) : string {
            //Regex to identify whitespaces and replace it with empty string.
            return srcCode.replace(/^\s+ | \s+$/g, "");
        }
    }
}