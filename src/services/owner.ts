import { v4 as uuidv4 } from "uuid";
import configFirebase from "config/firebase";
import { FirebaseApp } from "firebase/app";
import {
    Database,
    get,
    getDatabase,
    push,
    query,
    ref,
    set,
    serverTimestamp,
} from "firebase/database";
import {
    IDs,
    Poster,
    Service,
    ServiceData,
    ServiceDetail,
    ServiceOwnerRequest,
    ServiceRequest,
} from "models";
import { DEFAULT_ERROR, DOCUMENTS } from "utils/constant";
import OwnerServiceSupport from "./support/owner";

class OwnerService extends OwnerServiceSupport {
    config: FirebaseApp;

    database: Database;

    constructor({
        config,
        database,
    }: {
        config: FirebaseApp;
        database: Database;
    }) {
        super(database);
        this.config = config;
        this.database = database;
    }

    async GetDetailService({ sid, hid }: Pick<IDs, "sid" | "hid">) {
        return this.ProxyRequest(async () => {
            return {
                ...(await this.GetService({ sid, hid })),
                ...(await this.GetServiceData({ sid, hid })),
            } as unknown as ServiceDetail;
        });
    }

    async OrderService({ sid, uid, hid }: Pick<IDs, "sid" | "uid" | "hid">) {
        return this.ProxyRequest(async () => {
            const date = new Date().getTime();
            await this.AddServiceDataRequest({
                sid,
                uid,
                data: {
                    uid,
                    date,
                },
            });
            await this.AddAssignmentRequest({
                uid,
                data: {
                    sid,
                    uid: hid,
                    date,
                    status: "waiting",
                },
            });
            return date;
        });
    }

    async CreatePoster({
        uid,
        data,
    }: Pick<IDs, "uid"> & {
        data: Poster;
    }) {
        return this.ProxyRequest(async () => {
            const id = uuidv4();
            await this._addPoster({
                pid: id,
                data: {
                    id,
                    uid,
                    date: serverTimestamp(),
                    status: "open",
                    ...data,
                },
            });
            return id;
        });
    }
}

const ownerService = new OwnerService({
    config: configFirebase.app,
    database: getDatabase(configFirebase.app),
});
export default ownerService;
