
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
