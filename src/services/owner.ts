import { v4 as uuidv4 } from "uuid";
import configFirebase from "config/firebase";
import { FirebaseApp } from "firebase/app";
import { Database, get, getDatabase, push, query, ref, set, serverTimestamp } from "firebase/database";
import { Bid, IDs, Poster, Service, ServiceData, ServiceDetail, ServiceOwnerOrder, ServiceOwnerRequest, ServiceRequest } from "models";
import { DEFAULT_ERROR, DOCUMENTS } from "utils/constant";
import Utils from "utils";
import OwnerServiceSupport from "./support/owner";

class OwnerService extends OwnerServiceSupport {
    config: FirebaseApp;

    database: Database;

    constructor({ config, database }: { config: FirebaseApp; database: Database }) {
        super(database);
        this.config = config;
        this.database = database;
    }

    async GetDetailService({ sid, hid }: Pick<IDs, "sid" | "hid">) {
        return this.ProxyRequest(async () => {
            return {
                ...(await this.getOneService({ sid })).val(),
                ...(await this.getOneServiceData({ sid })).val(),
            } as unknown as ServiceDetail;
        });
    }

    async OrderService({ sid, uid, hid }: Pick<IDs, "sid" | "uid" | "hid">) {
        return this.ProxyRequest(async () => {
            const date = serverTimestamp();
            await this.addServiceDataRequest({
                sid,
                data: {
                    uid,
                    date,
                },
            });
            await this.addAssignmentRequest({
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
            await this.addPoster({
                pid: id,
                data: {
                    id,
                    uid,
                    date: serverTimestamp(),
                    status: "open",
                    flag: `${data.title} ${data.skills?.join(" ")} ${data.category}`,
                    ...data,
                },
            });
            return id;
        });
    }

    async GetAllMyPoster({ uid }: Pick<IDs, "uid">) {
        return this.ProxyRequest(async () => {
            const posters = await this.myPosters({ uid });
            return Utils.parseTreeObjectToArray<Poster>(posters);
        });
    }

    async DetailPoster({ pid }: Pick<IDs, "pid">) {
        return this.ProxyRequest(async () => {
            const req = await this.getOnePoster({ pid });
            return req.val() as Poster;
        });
    }

    async SearchService(key: string) {
        return this.ProxyRequest(async () => {
            const req = await this.getAllShowServiceData();
            const services = Utils.parseTreeObjectToArray<ServiceData>(req.val() || {});
            return services.filter((service) => service.flag?.includes(key));
        });
    }
}

const ownerService = new OwnerService({
    config: configFirebase.app,
    database: getDatabase(configFirebase.app),
});
export default ownerService;
