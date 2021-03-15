//Used to declare global variables and start compiler.
//Declare lexer, parser, and token.
var _compiler : mackintosh.index;
var _lexer : mackintosh.lex;
var _parser : mackintosh.parse;
var _token : mackintosh.token;

//Initialize token stream, error counter, and the token index.
var tokens;
var errCount = 0;
var tokenIndex = 0;
var curToken;