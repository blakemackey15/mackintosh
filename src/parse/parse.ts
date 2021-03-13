import { token } from "../lexer/token";

//Class that represents parse/
export class parse {

    //Global Variables
    private parseTokens : Array<token>;
    
    //Get token stream from completed lex.
    constructor(tokenStream : Array<token>) {
        this.parseTokens = tokenStream;
    }
}