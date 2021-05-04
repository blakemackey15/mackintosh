/*
References: Here is a list of the resources I referenced while developing this project.
https://regex101.com/ - Useful tool I used to test my regular expressions for my tokens.
*/

module mackintosh {

    export class index {

        //Begins the compilation of the inputted code.
        public static startCompile() {
            //Set compilation flag to true.
            isCompiling = true;
            
            _Functions.log('INFO: Beginning Compilation...');

            //Get source code from text area input.
            let code = (<HTMLInputElement>document.getElementById("inputCode")).value;
            //code = mackintosh.compilerFunctions.trim(code);

            _Lexer.populateProgram(code);
            _Lexer.lex();        

            //Check if there is a $ at the end of the program, if not display warning.
            if(program[program.length - 1] != '$') {                
                _Functions.log('LEXER WARNING: End of Program $ Not Found.');
                warnCount++;
            }

            return isCompiling;
        }

        public static endCompile() {
            isCompiling == false;
            return isCompiling;
        }
    }

}