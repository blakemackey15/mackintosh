/*
References: Here is a list of the resources I referenced while developing this project.
https://www.debuggex.com/ - Useful tool I used to test my regular expressions for my tokens.
*/

import {lex} from './lexer/lex';
import {token} from './lexer/token';

const input : HTMLFormElement = document.querySelector('#input');
let _Lexer : lex;
let tokenStream : Array<token>;
let curToken : number;
let errors : number;
