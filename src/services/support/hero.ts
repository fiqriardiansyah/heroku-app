import { Database, get, ref, update } from "firebase/database";
import { IDs, Service, ServiceData, ServiceOwnerOrder, ServiceOwnerRequest } from "models";
import RealtimeDatabase from "services/utils/realtime-database";
import Utils from "utils";
import { DEFAULT_ERROR, DOCUMENTS } from "utils/constant";

class HeroServiceSupport extends RealtimeDatabase {
    database: Database;

    constructor(db: Database) {
        super(db);
        this.database = db;
    }

    async GetAllMyServices({ uid }: Pick<IDs, "uid">): Promise<Service[]> {
        return this.ProxyRequest(async () => {
            const services = await this.getAllMyServices({ uid });
            return Utils.parseTreeObjectToArray<Service>(services.val() || []);
        });
    }

    async GetAllMyServicesData({ uid }: Pick<IDs, "uid">): Promise<ServiceData[]> {
        return this.ProxyRequest(async () => {
            const servicesData = await this.getAllMyServicesData({ uid });
            return Utils.parseTreeObjectToArray<ServiceData>(servicesData.val() || []);
        });
    }

    async GetOneAssignmentOrder({ uid, sid }: Pick<IDs, "uid" | "sid">) {
        return this.ProxyRequest(async () => {
            const orders = await this.getAssignmentOrders({ uid });
            return Utils.parseTreeObjectToArray<ServiceOwnerOrder>(orders.val())?.find((el) => el.sid === sid);
        });
    }

    async GetOneAssignmentRequest({ uid, key }: Pick<IDs, "uid"> & {
        key: string;
    }) {
        return this.ProxyRequest(async () => {
            const requests = await this.getAssignmentRequests({ uid });
            return Utils.parseTreeObjectToArray<ServiceOwnerRequest>(requests.val() || {})?.find((el) => el?.key === key);
        });
    }
}

export default HeroServiceSupport;
