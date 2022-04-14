/*
based on https://gist.github.com/JamesMessinger/a0d6389a5d0e3a24814b
and https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#full_indexeddb_example
and https://gist.github.com/underground/d50e40170d54b8a0f8a3f4fdd466eee4
*/
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
export default class IDB {
  constructor(dbName, dbVersion, stores) {
      this.db;
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.stores = stores;
  }

  openDB() {
    if (!window.indexedDB) {
      callback({ message: 'Unsupported indexedDB' });
    }
    let request = window.indexedDB.open(this.dbName, this.dbVersion);

    request.onsuccess = e => {
      this.db = request.result;
    };
    request.onerror = e => callback(e.target.error);
    request.onupgradeneeded = e => {
      this.db = e.target.result;
      this.db.onabort = e2 => callback(e2.target.error);
      this.db.error = e2 => callback(e2.target.error);
      this.db.oncomplete = e2 => {
        stores.forEach((o) => {
          this.db.createObjectStore(o.name, o.option);
        });
      }
    };
  }

  deleteDB() {
    if (window.indexedDB) {
      window.indexedDB.deleteDatabase(this.dbName);
    }
  }

  deleteStore(storeName, callback=(()=>{})) {
    if (this.db) {
      this.db.deleteObjectStore();
      this.db.oncomplete = e => callback(e.target.result);
      this.db.onabort = e => callback(e.target.error);
      this.db.error = e => callback(e.target.error);
    }
  }

  upsert(storeName, data, callback=(()=>{})) {
    if (this.db && data) {
      let transaction = this.db.transaction([storeName], IDBTransaction.READ_WRITE);
      transaction.onabort = te => callback(te.target.error);
      transaction.onerror = te => callback(te.target.error);

      let request = transaction.objectStore(storeName).put(data);
      request.onerror = e => callback(e.target.error);
      request.onsuccess = e => callback(e.target.result);
    } else {
      console.log('failed upsert');
    }
  }

  get(storeName, key, callback=(()=>{})) {
    if (this.db && key) {
      let request = this.db.transaction([storeName]).objectStore().get(key)
      request.onerror = e => callback(e.target.error);
      request.onsuccess = e => callback(e.target.result);
    }
  }

  getAll(storeName, callback=(()=>{})) {
    if (this.db) {
      let request = this.db.transaction(storeName).objectStore(storeName).openCursor(null, IDBCursor.NEXT);
      let results = [];
      request.onsuccess = e => {
        let cursor = e.target.result;
        if (cursor) {
          console.log("Key:" + cursor.key + " Value:" + cursor.value);
          results.push({ [cursor.key]: cursor.value });
          cursor.continue();
        } else {
          callback(results);
        }
      };
      request.onerror = e => callback(e.target.error);
    }
  }

  remove(storeName, key, callback=(()=>{})) {
    if (this.db) {
      let request = this.db.transaction([storeName], IDBTransaction.READ_WRITE).objectStore(storeName).delete(key);
      request.onerror = e => callback(e.target.error);
      request.onsuccess = e => callback(e.target.result);
    }
  }

  clear(storeName, callback=(()=>{})) {
    if (this.db) {
      let request = this.db.transaction([storeName], IDBTransaction.READ_WRITE).objectStore(storeName).clear();
      request.onerror = e => callback(e.target.error);
      request.onsuccess = e => callback(e.target.result);
    }
  }

  count(storeName, callback=(()=>{})) {
    if (this.db) {
      let request = this.db.transaction([storeName]).objectStore(storeName).count();
      request.onerror = e => callback(e.target.error);
      request.onsuccess = e => callback(e.target.result);
    }
  }
}


export async function init_idb(db_name,db_version,object_stores) {
  idb = new IDB(db_name,db_version,object_stores);
   idb.openDB();

   let max_iter = MAX_RETRY_MILLIS;
   let i = 0;
   while (idb.db == null & i<max_iter) {
     await new Promise((resolve, reject) => setTimeout(resolve, 1));
     i++;
   }
   console.log(idb.db);
   return 1;
}
