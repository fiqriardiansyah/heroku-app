import { StorageError, UploadTask, UploadTaskSnapshot } from "firebase/storage";

class TaskUploader {

    id: any;

    uploadTask: UploadTask | null = null;

    constructor(
        id: any,
        uploadTask: UploadTask,
        onSnapshot: (s: UploadTaskSnapshot) => void,
        onError: (e: StorageError) => void,
        onComplete: () => void
    ) {
        this.id = id;
        this.uploadTask = uploadTask;
        this.uploadTask.on('state_changed', onSnapshot, onError, onComplete);
    }
}

export default TaskUploader;