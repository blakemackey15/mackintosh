//Used to declare global variables and start compiler.
//These variables represent the classes in the mackitosh module, and can be referenced in the 
//index by linking the mackintosh.js script.
//Declare lexer, parser, and token.
var _Compiler = mackintosh.index;
var _Lexer = mackintosh.lex;
var _Parser = mackintosh.parse;
var _Token = mackintosh.token;
var _Functions = mackintosh.compilerFunctions;

//Lex errors.
var errCount : number = 0;
//Parse errors.
var parseErrCount : number = 0;
//Lex warnings.
var warnCount : number = 0;
//Parse warnings.
var parseWarnCount : number = 0;
var tokenIndex : number = 0;
var curToken : mackintosh.token;
var isCompiling : boolean;
var program = new Array<string>();
var programCount : number = 1;
var lineNum : number = 1;
var tokenFlag : boolean;
var tokenBuffer : number = 0;
var keywords = new Array<string>("int", "print", "while", "string", 
"boolean", "while", "true", "false", "if");

//Regular Expressions to check token type.
var digits = new RegExp('(?:0|[1-9]\d*)');
var characters = new RegExp('^[a-z]*$');
var leftBlock = new RegExp('[{]');
var rightBlock = new RegExp('[}]');
var operator = new RegExp('[+]');
var boolOperator = new RegExp('(?:^|[^!=])([!=]=)(?!=)');
var endProgram = new RegExp('[$]');
var quotes = new RegExp('["]');
var intRegEx = new RegExp('in(t)');
var stringRegEx = new RegExp('strin(g)');
var printRegEx = new RegExp('prin(t)');
var falseRegEx = new RegExp('fals(e)');
var trueRegEx = new RegExp('tru(e)');
var ifRegEx = new RegExp('i(f)');
var whileRegEx = new RegExp('whil(e)');
var boolRegEx = new RegExp('boolea(n)');
var openComments = new RegExp('[\/\*]');
var closeComments = new RegExp('[\*\/]');
var assignment = new RegExp('[=]');
var newLine = new RegExp('\n');
var whitespace = new RegExp('[ \t]');

//Parser globals.
var CSTTree = new mackintosh.CST;
var isMatch : boolean;
var tokenPointer : number = 0;



