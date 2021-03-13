//Class that represents a singular node in a tree.
export class treeNode {
    //Decalre tree variables.
    //Hold values of node, refrence to left and right child node.
    private value : number
    private leftNode : treeNode;
    private rightNode : treeNode;
    //Notes a valid syntax token in the grammar.
    private isLeaf : boolean;

    //Initialize a tree node.
    constructor(nodeVal: number) {
        this.value = nodeVal;
        this.leftNode = null;
        this.rightNode = null;
    }

    //Get and set methods for node attributes.
    public getValue() : number {
        return this.value
    }

    public setValue(num : number) {
        this.value = num;
    }

    public get RightNode() : treeNode {
        return this.rightNode;
    }

    public set RightNode(node : treeNode) {
        this.rightNode = node;
    }

    public get LeftNode() {
        return this.leftNode;
    }

    public set LeftNode(node : treeNode) {
        this.leftNode = node;
    }

}