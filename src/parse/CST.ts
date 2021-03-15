module mackintosh {


export class CST {
    private rootNode : treeNode;

    constructor() {
        this.rootNode = null;
    }

    public getRoot() {
        return this.rootNode;
    }

    public setRoot(node : treeNode) {
        this.rootNode = node;
    }

    //Add nodes to the tree
    public addNode(nodeVal : number) : boolean {
        let newNode = new treeNode(nodeVal)

        //Check if the node is empty. If it is, make the new node the root node.
        if(this.rootNode == null) {
            this.setRoot(newNode);
            return true;
        }

        //If the root node is not empty, add it to the correct spot in the tree.
        else {

        }
    }

    //Recursive definition of depth first traversal - needed to get the valid tokens produced by the CST.
    public depthFirst () : number[] {
        let visit = new Array<number>();
        let curNode = this.getRoot();

        function traverse(node : treeNode) {
            
            //Array of visited node values.
            visit.push(node.getValue());

            //Check to see if node is right or left and then traverse the corresponding one.
            if(node.LeftNode) {
                traverse(node.LeftNode);
            }

            if(node.RightNode) {
                traverse(node.RightNode);
            }

        }

        traverse(curNode);
        return visit;
    }

}
}