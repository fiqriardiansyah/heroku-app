import { Database, get, ref } from "firebase/database";
import { Assignments, IDs, Poster, Service, ServiceData, ServiceOrder, ServiceOwnerRequest } from "models";
import RealtimeDatabase from "services/utils/realtime-database";
import Utils from "utils";
import { DEFAULT_ERROR, DOCUMENTS } from "utils/constant";

class OwnerServiceSupport extends RealtimeDatabase {
    database: Database;

    constructor(db: Database) {
        super(db);
        this.database = db;
    }

    async GetMyAssigments({ uid }: Pick<IDs, "uid">): Promise<Assignments> {
        return this.ProxyRequest(async () => {
            const assignments = (await this.getAssigments({ uid })).val();
            return {
                orders: Utils.parseTreeObjectToArray(assignments?.orders || {}),
                request: Utils.parseTreeObjectToArray(assignments?.request || {}),
                finish: Utils.parseTreeObjectToArray(assignments?.finish || {}),
            };
        });
    }

    async GetOneServiceOrder({ uid, sid }: Pick<IDs, "uid" | "sid">) {
        return this.ProxyRequest(async () => {
            const service = (await this.getOneServiceData({ sid })).val() as ServiceData;
            if (!service) {
                throw new Error("Service not found!");
            }
            const order = Utils.parseTreeObjectToArray<ServiceOrder>(service.orders || {})?.find((ord) => ord.uid === uid);
            if (!order) {
                throw new Error("Order not found!");
            }
            return order;
        });
    }

    async GetOnePoster({ pid }: Pick<IDs, "pid">) {
        return this.ProxyRequest(async () => {
            return (await this.getOnePoster({ pid })).val() as Poster;
        })
    }

    async GetOneAssignmentRequestWithKey({ uid, key }: Pick<IDs, "uid"> & {
        key: string;
    }) {
        return this.ProxyRequest(async () => {
            const res = (await this.getAssignmentRequests({ uid })).val();
            const requests = Utils.parseTreeObjectToArray<ServiceOwnerRequest>(res || {})
            return requests.find((request) => request?.key === key);
        })
    }
}

export default OwnerServiceSupport;
