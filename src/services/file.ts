import configFirebase from "config/firebase";
import { v4 as uuid } from 'uuid';
import { FirebaseStorage, getStorage, StorageError, UploadTaskSnapshot } from 'firebase/storage';
import { FirebaseApp } from "firebase/app";
import { IDs } from "models";
import StorageFirebase from "./utils/storage";

class FileService extends StorageFirebase {
    config: FirebaseApp;

    chats = 'chats';

    constructor({ config, storage }: { config: FirebaseApp, storage: FirebaseStorage }) {
        super(storage);
        this.config = config;
    }

    SaveChatFile({ file }: { file: File }) {
        const extension = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
        const newName = `${uuid()}.${extension}`;
        const path = `${this.chats}/${newName}`;
        const task = this.uploadFile({ file, path })
        return task;
    }

    // SaveChatFile({ file, uid }: { file: File, uid: Pick<IDs, 'uid'> },
    //     snapshot: (snpsht: UploadTaskSnapshot) => void,
    //     error: (err: StorageError) => void,
    //     complete: () => void) {
    //     const extension = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
    //     const newName = `${uuid()}.${extension}`;
    //     const path = `${this.chats}/${uid}/${newName}`;
    //     const task = this.uploadFile({ file, path })
    //     task.on('state_changed', snapshot, error, complete);
    //     return task;
    // }

}

const fileService = new FileService({
    config: configFirebase.app,
    storage: getStorage(configFirebase.app)
});
export default fileService;
