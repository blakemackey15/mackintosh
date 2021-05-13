module mackintosh {
    /* 
    
    Interface for static table and jump table.
    Since both of these tables share common elements, if they implement this interface they will have these properties.

     */
    export interface codeGenTable<Entry> {
        tableEntries : Array<Entry>;
        curTemp : number;
        //Used to match the format for temp ids per table.
        tempIdMatch : RegExp;


        addEntry(entry : Entry) : Entry;
        getNextTemp() : string;
        backpatch(table : executableImage) : void;
        getByTemp(tempId : string) : Entry;
    }
}