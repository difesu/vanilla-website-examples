//try open any version of it, depending on browser's age
const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

//create (if not exists) the database (<name>,<version>)
const request = indexedDB.open("dbFromRestcall", 1);

request.onerror = function (event) {
    console.error("Error with IndexedDB");
    console.error(event);
};

request.onupgradeneeded = function () {
    const db = request.result;
    // (objectStoreName, "primary-key")
    const store = db.createObjectStore("myObjectStore", { keyPath: "id" });
    store.createIndex("index1", ["column1"], { unique: false });
    store.createIndex("compound_index1", ["column1", "column2"], { unique: false });
};

const userAction = async () => {
    const response = await fetch('http://localhost:5000/table');
    const myJson = await response.json();
    console.log(myJson) ;
    // do something with myJson
  
    const db = request.result;
    //start a transaction.
    //group all operations that require to fail together in one trans
    //try to minimize the number of transactions
    const transaction = db.transaction("myObjectStore", "readwrite");

    const store = transaction.objectStore("myObjectStore");
    const index1 = store.index("index1");
    const compoundIndex1 = store.index("compound_index1");

    //add some objects
    
    for (const entry of myJson){
        store.put(entry);
    }
    

    //if multiple match, and want only 1, use get instead of getall

    const idQuery = store.get(4);
    idQuery.onsuccess = function () {
        console.log('idQuery', idQuery.result);
    };
    const index1Query = index1.getAll("id1c1");
    index1Query.onsuccess = function () {
        console.log('index1Query', index1Query.result);
    };
    const colourMakeQuery = compoundIndex1.get(["c1v1", "c2v2"]);
    colourMakeQuery.onsuccess = function () {
        console.log('colourMakeQuery', colourMakeQuery.result);
    };

    transaction.oncomplete = function () {
        db.close();
    };
    //transaction end 
};