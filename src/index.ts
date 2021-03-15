/*
References: Here is a list of the resources I referenced while developing this project.
https://regex101.com/ - Useful tool I used to test my regular expressions for my tokens.
*/

module mackintosh {

    export class index {
        private _lexer : lex;
        private _parser : parse;
        private isCompiling : boolean = false;
        private warningCount : number; 
        private code : string;


        constructor() {
            this._lexer = new lex();
            this.startCompile();
            this.endCompile();
        }

        //Sets the inputted program.
        public setSrcCode(code : string) {
            this.code = code;
        }

        public getSrcCode() {
            return this.code;
        }

        //Begins the compilation of the inputted code.
        public startCompile() : boolean {
            this.isCompiling = true;
            console.log('INFO: BEGINNING PROGRAM COMPILATION...');
            let inputtedCode = this._lexer.testProgram(this.getSrcCode());
            this._lexer.lex();

            //Check if there is a $ at the end of the program, if not display warning.
            if(inputtedCode[inputtedCode.length - 1] != '$') {                
                console.log('LEXER WARNING - PROGRAM END $ NOT FOUND');
                this.warningCount++;
            }

            return true;
        }

        public endCompile() : boolean {
            this.isCompiling == false;
            return false;
        }
    }

}