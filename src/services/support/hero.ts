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
            return Utils.parseTreeObjectToArray<Service>(services);
        });
    }

    async GetAllMyServicesData({ uid }: Pick<IDs, "uid">): Promise<ServiceData[]> {
        return this.ProxyRequest(async () => {
            const servicesData = await this.getAllMyServicesData({ uid });
            return Utils.parseTreeObjectToArray<ServiceData>(servicesData);
        });
    }

    async GetOneAssignmentOrder({ uid, sid, date }: Pick<IDs, "uid" | "sid"> & { date: number }) {
        return this.ProxyRequest(async () => {
            const orders = await this.getAssignmentOrders({ uid });
            return Utils.parseTreeObjectToArray<ServiceOwnerOrder>(orders)?.find((el) => el.sid === sid && el.date === date);
        });
    }

    async GetOneAssignmentRequest({ uid, sid }: Pick<IDs, "uid" | "sid">) {
        return this.ProxyRequest(async () => {
            const requests = await this.getAssignmentRequests({ uid });
            return Utils.parseTreeObjectToArray<ServiceOwnerRequest>(requests)?.find((el) => el.sid === sid);
        });
    }
}

export default HeroServiceSupport;
