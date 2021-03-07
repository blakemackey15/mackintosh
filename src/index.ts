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

import {lex} from './lexer/lex';

export class index {
    private _lexer : lex;
    public isCompiling : boolean = false;

    constructor() {
        this._lexer = new lex();
        this.startCompile();
    }

    public startCompile() : boolean {
        console.log('BEGINNING COMPILATION...');
        let inputtedCode = this._lexer.testProgram();
        this._lexer.lex();
        return true;
    }

    public endCompule() : boolean {
        return false;
    }

}