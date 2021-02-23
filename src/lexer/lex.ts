import {token} from "./token";


class lex {
    //regular expressions to represent our language's grammar. these expressions are declared in the rule order
    private keyword = new RegExp('');
    private id = new RegExp('');
    private symbol = new RegExp('');
    private digit = new RegExp('');
    private braces = new RegExp('');

    constructor() {

    }

}