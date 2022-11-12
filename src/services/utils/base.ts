import { getDatabase, orderByChild } from 'firebase/database';
import configFirebase from "config/firebase";
import { addDoc, collection, doc, Firestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { IDs } from 'models';
import { DEFAULT_ERROR } from "utils/constant";
import { ChatDoc, MessageBuble } from "../../models/data";
import RealtimeDatabase from './realtime-database';

class BaseService {

    async ProxyRequest<T>(request: () => Promise<T>): Promise<T> {
        try {
            return request();
        } catch (error: any) {
            const message = error?.message || DEFAULT_ERROR;
            throw new Error(message);
        }
    }

}

export default BaseService;
