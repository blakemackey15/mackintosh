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

import { readFileSync } from 'fs';
import { lex } from './lexer/lex';
import * as readline from 'readline';
const prompt = require('prompt');

//Allows the user to input their source code.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export class index {
    private _lexer : lex;
    public isCompiling : boolean = false;
    private warningCount : number; 

    constructor() {
        this._lexer = new lex();
        this.startCompile();
        this.endCompile();
    }

    //Method to get src code input using readline interface and remove whitespaces.
    public getSrcCode() : string {
        let srcCode = readFileSync('./src/srcCode.txt', 'utf-8');
        srcCode.replace(/\s+/g, '');
        let newline = new RegExp('\r?\n|\r');
        srcCode.replace(newline, '');
        srcCode.replace('\t', '');
        return srcCode;
    }

    public startCompile() : boolean {
        console.log('INFO: BEGINNING PROGRAM COMPILATION...');
        let code = this.getSrcCode();
        let inputtedCode = this._lexer.testProgram(code);
        this._lexer.lex();

        //Check if there is a $ at the end of the program, if not display warning.
        if(inputtedCode[inputtedCode.length - 1] != '$') {
            console.log('LEXER WARNING - PROGRAM END $ NOT FOUND');
            this.warningCount++;
        }

        return true;
    }

    public endCompile() : boolean {
        return false;
    }
}

let compiler : index = new index();