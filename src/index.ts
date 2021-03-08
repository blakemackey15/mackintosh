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
const prompt = require('prompt');

//Allows the user to input their source code.
const rl = readline.createInterface({
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
        // rl.question("Please enter source code to be compiled: ", function(answer) {
        //     console.log("SRC INPUT RECIEVED " + answer);
        //     rl.close();
        //     this.srcCode = answer;
        // });
    }

    public startCompile() : boolean {
        console.log('INFO: BEGINNING COMPILATION...');
        let inputtedCode = this._lexer.testProgram("1");
        this._lexer.lex(inputtedCode);

        //Check if there is a $ at the end of the program, if not display warning.s
        if(inputtedCode.charAt(inputtedCode.length) != '$') {
            console.log("LEXER WARNING - PROGRAM END $ NOT FOUND");
        }
        return true;
    }

    public endCompile() : boolean {
        return false;
    }

}

let compiler : index = new index();