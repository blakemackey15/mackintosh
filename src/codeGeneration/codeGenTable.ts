module mackintosh {
    /* 
    
    Interface for static table and jump table.
    Since both of these tables share common elements, if they implement this interface they will have these properties.

     */
    export interface codeGenTable<E> {
        tableEntries : Array<E>;
        curTemp : number;
        TempIdHex : number;

        addEntry(entry : E) : E;
        getNextTemp() : string;
        backpatch(table : executableImage) : void;
        getByTemp(tempId : string) : E;
    }
}