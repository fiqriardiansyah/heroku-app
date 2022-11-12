import { StorageError, UploadTask, UploadTaskSnapshot } from "firebase/storage";
import { IDs, TaskProgress } from "models";
import React, { useState } from "react";
import chatService from "services/chat";
import TaskUploader from "services/uploder";
import { DEFAULT_ERROR } from "utils/constant";

type UploaderProps = {
    file: File,
    messageId: string
}

const useFileUpload = (uploader: (params: UploaderProps) => UploadTask, { cid }: Pick<IDs, 'cid'>) => {

    const [tasksProgress, setTasksProgress] = useState<TaskProgress[]>([]);

    const addTask = (task: TaskProgress) => {
        setTasksProgress((prev) => ([...prev, task]));
    }

    const removeTask = (id: string) => {
        setTasksProgress((prev) => [...prev].filter((task) => task.mid !== id));
    }

    const updateTask = ({ data, id }: { data: Partial<TaskProgress>, id: string }) => {
        setTasksProgress((prev) => [...prev].map((task) => {
            if (task.mid === id) {
                return {
                    ...task,
                    ...data,
                }
            }
            return task;
        }));
    }

    const onSnapshot = (snpsht: UploadTaskSnapshot, id: string) => {
        const progress = (snpsht.bytesTransferred / snpsht.totalBytes) * 100;
        updateTask({
            id, data: {
                progress,
            }
        })
    }

    const onError = (err: StorageError, id: string) => {
        updateTask({
            id, data: {
                error: err?.message || DEFAULT_ERROR,
            }
        });
        chatService.updateMessage({
            cid, mid: id, data: {
                statusFile: 'failed',
            }
        });
    }

    const onComplete = (id: string, uploadTask: UploadTask) => {
        chatService.AddLinkFileToMessage({ cid, mid: id, uploadTask }, () => {
            removeTask(id);
        });
    }

    const uploadFile = (prm: UploaderProps) => {
        const uploadTask = uploader(prm);
        const taskUploader = new TaskUploader(prm.messageId, uploadTask, (s) => onSnapshot(s, prm.messageId), (e) => onError(e, prm.messageId), () => onComplete(prm.messageId, uploadTask));
        addTask({
            mid: prm.messageId,
            error: null,
            progress: 0,
            task: uploadTask,
        });
    }

    return {
        uploadFile,
        tasksProgress
    }
}

export default useFileUpload;