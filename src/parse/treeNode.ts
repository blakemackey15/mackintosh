//Class that represents a singular node in a tree.
class treeNode {
    //Decalre tree variables.
    //Hold values of node, refrence to left and right child node.
    private value : number
    private leftNode : treeNode;
    private rightNode : treeNode;

    //Initialize a tree node.
    constructor(nodeVal: number) {
        this.value = nodeVal;
        this.leftNode = null;
        this.rightNode = null;
    }

    public getValue() : number {
        return this.value
    }

    public setValue(num : number) {
        this.value = num;
    }

    public getRightNode() : treeNode {
        return this.rightNode;
    }

    public setRightNode(node : treeNode) {
        this.rightNode = node;
    }

    public getLeftNode() {
        return this.leftNode;
    }

    public setLeftNoode(node : treeNode) {
        this.leftNode = node;
    }



}