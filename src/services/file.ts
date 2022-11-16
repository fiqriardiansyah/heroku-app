import configFirebase from "config/firebase";
import { v4 as uuid } from 'uuid';
import { FirebaseStorage, getDownloadURL, getStorage, StorageError, StorageReference, UploadTaskSnapshot } from 'firebase/storage';
import { FirebaseApp } from "firebase/app";
import { IDs } from "models";
import Utils from "utils";
import StorageFirebase from "./utils/storage";

class FileService extends StorageFirebase {
    config: FirebaseApp;

    chats = 'chats';

    files = 'files';

    constructor({ config, storage }: { config: FirebaseApp, storage: FirebaseStorage }) {
        super(storage);
        this.config = config;
    }

    SaveChatFile({ file }: { file: File }) {
        const path = `${this.chats}/${Utils.generateFileName({ file })}`;
        const task = this.uploadFile({ file, path });
        return task;
    }

    UploadMultipleFile({ files }: { files: File[] }) {
        return this.ProxyRequest(() => {
            return Promise.all(files.map((file) => {
                const path = `${this.files}/${Utils.generateFileName({ file })}`;
                return this.uploadFile({ file, path });
            }));
        });
    }

    GetMultipleDownloadUrl({ refs }: { refs: StorageReference[] }) {
        return this.ProxyRequest(() => {
            return Promise.all(refs.map((ref) => {
                return getDownloadURL(ref);
            }));
        });
    }

    async UploadFileAndGetDownloadUrl(file: File) {
        return this.ProxyRequest(async () => {
            const path = `${this.files}/${Utils.generateFileName({ file })}`;
            const task = await this.uploadFile({ file, path });
            const url = await getDownloadURL(task.ref);
            return url;
        });
    }

}

const fileService = new FileService({
    config: configFirebase.app,
    storage: getStorage(configFirebase.app)
});
export default fileService;
