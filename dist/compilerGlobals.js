//Used to declare global variables and start compiler.
//These variables represent the classes in the mackitosh module, and can be referenced in the 
//index by linking the mackintosh.js script.
//Declare lexer, parser, and token.
var _Compiler = mackintosh.index;
var _Lexer = mackintosh.lex;
var _Parser = mackintosh.parse;
var _Token = mackintosh.token;
var _Functions = mackintosh.compilerFunctions;
var _SemanticAnalyzer = mackintosh.semanticAnalyser;
var _CodeGenerator = mackintosh.codeGenerator;
var symbolTable = new mackintosh.symbolTableTree;
//Lex errors.
var errCount = 0;
//Parse errors.
var parseErrCount = 0;
//Lex warnings.
var warnCount = 0;
//Parse warnings.
var parseWarnCount = 0;
var tokenIndex = 0;
var curToken;
var isCompiling;
var program = new Array();
var programCount = 1;
var lineNum = 1;
var tokenFlag;
var tokenBuffer = 0;
var keywords = new Array("int", "print", "while", "string", "boolean", "while", "true", "false", "if");
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
var isMatch = false;
var tokenPointer = 0;
var ASTTree = new mackintosh.CST;
var isASTNode = false;
//Semantic Analysis Globals
var scopePointer = 0;
var semErr = 0;
var semWarn = 0;
//Code gen globals
var genErr = 0;
var genWarn = 0;
var _executableImage = new mackintosh.executableImage;
var _staticTable = new mackintosh.staticTable;
var _jumpTable = new mackintosh.jumpTable;
var curScope = 0;
//# sourceMappingURL=compilerGlobals.js.map