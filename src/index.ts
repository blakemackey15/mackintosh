/*
References: Here is a list of the resources I referenced while developing this project.
https://regex101.com/ - Useful tool I used to test my regular expressions for my tokens.
*/

// //Import Objects and css
// import './public/css/mackComp';
// const inputForm : HTMLFormElement = document.querySelector('#input');

// inputForm.onsubmit = () => {
//     const formData = new FormData(inputForm);
//     console.log(formData)
//     const text = formData.get('textInput') as string;
//     console.log(text);
//     return false;
// };

import { lex } from './lexer/lex';
import * as readline from 'readline';

//Allows the user to input their source code.
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("test");

export class index {
    private _lexer : lex;
    public isCompiling : boolean = false;
    private srcCode : string;

    constructor() {
        this._lexer = new lex();
        this.getSrcCode();
        this.startCompile();
    }

    //Method to get src code input using readline interface.
    public getSrcCode() {
        rl.question("Please enter source code to be compiled: ", function(answer) {
            console.log("SRC INPUT RECIEVED " + answer);
            this.srcCode = answer;
            rl.close();
        });
    }

    public startCompile() : boolean {
        console.log('BEGINNING COMPILATION...');
        let inputtedCode = this._lexer.testProgram(this.srcCode);
        this._lexer.lex(inputtedCode);
        return true;
    }

    public endCompile() : boolean {
        return false;
    }

}

let compiler : index = new index();