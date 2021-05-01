module mackintosh {

    //TypeScript Hashmap interface source: https://github.com/TylorS/typed-hashmap
    export class semanticAnalyser {
        public static semanticAnalysis() {
            try {
                scopePointer = 0;
                symbolTable = new symbolTableTree();
                _Functions.log("SEMANTIC ANALYSIS - Beginning Semantic Analysis " + (programCount - 1));
            } catch (error) {
                _Functions.log(error);
                _Functions.log("SEMANTIC ANALYSIS - Ended due to error.");
            }
            //symbolTable.traverseAST(ASTTree);
        }
        /* 
            Method to traverse through the AST and perform semantic analysis.
            Based on the toString method. Instead of traversing and turning it into a string, semantic analysis will be
            performed on the AST. 
        */
        public static traverseAST() {
            function expand(node : CSTNode, depth : number) {
                let scopeVal = new scope(null, null);
                let map = new Map();
                //Check node names. Then, perform the correct analysis.
                if(node.getNodeName() == "Block") {
                    scopeVal = semanticBlock(map, node, scopeVal);
                }

                if(node.getNodeName() == "PrintStatement") {

                }

                if(node.getNodeName() == "AssignmentStatement") {

                }

                if(node.getNodeName() == "VarDecl") {
                    semanticVarDecl(map, node, scopeVal);
                }

                if(node.getNodeName() == "WhileStatement") {

                }

                if(node.getNodeName() == "IfStatement") {

                }

                //Continue on to the next nodes in the tree.
                for(let i = 0; i < node.getChildren().length; i++) {
                    expand(node.getChildren()[i], depth + 1);
                }
            }

            function semanticBlock(map : Map<any, scope>, node : CSTNode, scope : scope) : scope {
                scopePointer++;
                _Functions.log("SEMANTIC ANALYSIS - Found Block, opening new scope " + scopePointer);
                scope.setType(null);
                scope.setValue(null);
                return scope;
            }

            function semanticPrintStatement(map : Map<any, scope>, node : CSTNode) {

            }
            
            function semanticAssignmentStatement(map : Map<any, scope>, node : CSTNode, scope : scope) {
                let children = node.getChildren();
                let symbol = children[0].getNodeName();
                let value = children[1].getNodeName();
                scope.setValue(value);

                //Check if the symbol is in the map. If not, throw an error.
                if(map.has(symbol)) {
                    map.set(symbol, scope);
                }

                //Check if the parent scopes have the symbol.
                else if(symbolTable.getCurNode().getParentScope().getMap().has(symbol)) {

                }

                else {
                    throw new Error("SEMANTIC ANALYSIS - Symbo")
                }
            }

            function semanticVarDecl(map : Map<any, scope>, node : CSTNode, scope : scope) {
                //Get the children and their names, and then add them to the map.
                let children = node.getChildren();
                let type = children[0].getNodeName();
                let symbol = children[1].getNodeName();

                //Define the value of the scope, and then add it to the tree.
                scope.setType(type);
                map.set(symbol, scope);
                symbolTable.addNode(map);
            }

            function semanticWhileStatement(map : Map<any, scope>, node : CSTNode) {

            }

            function semanticIfStatement(map : Map<any, scope>, node : CSTNode) {

            }
            //Start from the root node.
            expand(ASTTree.getRoot(), 0);
        }

    }
}