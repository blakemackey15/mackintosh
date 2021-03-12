import { treeNode } from 'treeNode';

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
        let newNode = treeNode(nodeVal)

        //Check if the node is empty. If it is, make the new node the root node.
        if(this.rootNode == null) {
            this.setRoot(newNode);
            return true;
        }
    }

}