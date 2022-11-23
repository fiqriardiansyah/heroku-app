import configFirebase from "config/firebase";
import { FirebaseApp } from "firebase/app";
import { child, Database, get, getDatabase, ref, set } from "firebase/database";
import { User } from "models";
import { DEFAULT_ERROR, DOCUMENTS } from "utils/constant";
import RealtimeDatabase from "./utils/realtime-database";

class UserService extends RealtimeDatabase {
    config: FirebaseApp;

    database: Database;

    constructor({ config, db }: { config: FirebaseApp, db: Database }) {
        super(db);
        this.config = config;
        this.database = db;
    }

    async CreateUser(data: User) {
        return this.ProxyRequest(async () => {
            const request = await set(ref(this.database, `${DOCUMENTS.users}/${data.uid}`), data);
            return request;
        });
    }

    async UpdateUser(data: User) {
        return this.ProxyRequest(async () => {
            await this.udpateUser(data);
            return null;
        });
    }

    async GetUser(uid: string): Promise<User> {
        return this.ProxyRequest(async () => {
            const request = await get(child(ref(this.database), `${DOCUMENTS.users}/${uid}`));
            return request.val();
        });
    }
}

const userService = new UserService({
    config: configFirebase.app,
    db: getDatabase(configFirebase.app)
});
export default userService;
