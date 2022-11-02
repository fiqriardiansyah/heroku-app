import configFirebase from "config/firebase";
import { FirebaseApp } from "firebase/app";
import { child, Database, get, getDatabase, ref, set } from "firebase/database";
import { User } from "models";
import { DEFAULT_ERROR, DOCUMENTS } from "utils/constant";

class UserService {
    config: FirebaseApp;

    database: Database;

    constructor(config: FirebaseApp) {
        this.config = config;
        this.database = getDatabase(this.config);
    }

    async CreateUser(data: User) {
        try {
            const request = await set(
                ref(this.database, `${DOCUMENTS.users}/${data.uid}`),
                data
            );
            return request;
        } catch (error: any) {
            const message = error?.message || DEFAULT_ERROR;
            throw new Error(message);
        }
    }

    async GetUser(uid: string): Promise<User> {
        try {
            const request = await get(
                child(ref(this.database), `${DOCUMENTS.users}/${uid}`)
            );
            return request.val();
        } catch (error: any) {
            const message = error?.message || DEFAULT_ERROR;
            throw new Error(message);
        }
    }
}

const userService = new UserService(configFirebase.app);
export default userService;
