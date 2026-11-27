const databaseName = 'kingdom-adventurer';
const storeName = 'saves';
const slot = 'current';
let connection;

function openDatabase() {
  if (!connection) {
    connection = new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
      let blocked = false;
      request.onupgradeneeded = () => request.result.createObjectStore(storeName);
      request.onerror = () => reject(request.error);
      request.onblocked = () => {
        blocked = true;
        reject(new Error('IndexedDB upgrade blocked'));
      };
      request.onsuccess = () => {
        const db = request.result;
        if (blocked) return db.close();
        db.onversionchange = () => {
          db.close();
          connection = null;
        };
        resolve(db);
      };
    }).catch(error => {
      connection = null;
      throw error;
    });
  }
  return connection;
}

let pending = Promise.resolve();

function operation(mode, action) {
  const result = pending.then(async () => {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      transaction.onabort = () => reject(transaction.error ?? new Error('Save transaction aborted'));
      transaction.oncomplete = () => resolve(request.result);
      const request = action(transaction.objectStore(storeName));
    });
  });
  pending = result.catch(() => {});
  return result;
}

export const readSave = () => operation('readonly', store => store.get(slot));
export const writeSave = data => operation('readwrite', store => store.put(data, slot));
export const deleteSave = () => operation('readwrite', store => store.delete(slot));
