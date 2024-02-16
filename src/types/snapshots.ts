export interface ISnapshot<T> {
  getState(): T;
}

export interface ISnapshotStorage<T> {
  retrieveAndRemoveSnapshot: () => T | null;
  createAndStoreSnapshot: () => void;
  clear: () => void;
  isEmpty:() => boolean;
}
