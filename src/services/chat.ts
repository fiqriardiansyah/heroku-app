import configFirebase from "config/firebase";
import { v4 as uuid } from 'uuid';
import { FirebaseApp } from "firebase/app";
import { collection, Firestore, getDocs, getFirestore, query, where, serverTimestamp } from "firebase/firestore";
import { ChatInfo, IDs } from "models";
import { DataMessage } from "module/chat/models";
import Utils from "utils";
import { getDownloadURL, UploadTask } from "firebase/storage";
import CloudFirestore from "./utils/cloud-firestore";

class ChatService extends CloudFirestore {
    config: FirebaseApp;

    constructor({ config, db }: { config: FirebaseApp, db: Firestore }) {
        super(db);
        this.db = db;
        this.config = config;
    }

    async SendMessage({
        data,
        uid,
        uid2,
        anyid,
        anytitle,
        typework,
    }: Pick<IDs, 'uid' | 'uid2' | 'anyid'> & {
        data: DataMessage,
        anytitle: string,
        typework: ChatInfo['type_work'];
    }) {
        const uids = [uid, uid2];
        const chatId = Utils.createChatId({ uids, postfix: anyid })
        const id = uuid();
        const time = new Date().getTime();

        return this.ProxyRequest(async () => {
            uids.forEach((el, i) => {
                this.realtimeDatabase?.updateInfoChatUser({
                    cid: chatId,
                    uid: el,
                    data: {
                        cid: chatId,
                        anytitle,
                        anyid,
                        last_chat: time,
                        last_message: data.message,
                        uid: i === 0 ? uids[1] : uids[0],
                        type: data.typeFile || 'text',
                        type_work: typework,
                    }
                })
            });
            await this.addMessage({
                chatId,
                chatDoc: {
                    anytitle,
                    participants: [uid, uid2],
                    anyid,
                    last_update: time,
                },
                message: {
                    date: time,
                    file: '',
                    id: Utils.removeDashes(id),
                    message: data.message,
                    senderUid: uid,
                    typeFile: data.typeFile,
                    statusFile: data.file ? 'uploading' : 'none',
                    nameFile: data.file?.name || '',
                }
            });
            return Utils.removeDashes(id);
        })
    }

    async AddLinkFileToMessage({ mid, uploadTask, cid }: Pick<IDs, 'mid' | 'cid'> & {
        uploadTask: UploadTask;
    }, callback: () => void) {
        return this.ProxyRequest(async () => {
            const url = await getDownloadURL((await uploadTask).ref)
            await this.updateMessage({
                cid,
                mid,
                data: {
                    statusFile: 'uploaded',
                    file: url,
                }
            })
            callback();
        });
    }
}

const chatService = new ChatService({
    config: configFirebase.app,
    db: getFirestore(configFirebase.app)
});
export default chatService;
