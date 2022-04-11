/*
based on https://gist.github.com/JamesMessinger/a0d6389a5d0e3a24814b
and https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#full_indexeddb_example
*/
export  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
export var db;
export function openDb(db_name,db_version, db_store_name, key_path, key_auto_inc) {
  console.log("openDb ...");
  var req = indexedDB.open(db_name, db_version);
  req.onsuccess = function (evt) {
    // Equal to: db = req.result;
    db = this.result;
    console.log("openDb DONE");
  };
  req.onerror = function (evt) {
    console.error("openDb:", evt.target.errorCode);
  };

  req.onupgradeneeded = function (evt) {
    console.log("openDb.onupgradeneeded");
    var store = evt.currentTarget.result.createObjectStore(
      db_store_name, { keyPath: key_path, autoIncrement: key_auto_inc });


  };
}
