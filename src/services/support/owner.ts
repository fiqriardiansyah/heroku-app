import { Database, get, ref } from "firebase/database";
import { IDs, Service, ServiceData } from "models";
import RealtimeDatabase from "services/utils/realtime-database";
import Utils from "utils";
import { DEFAULT_ERROR, DOCUMENTS } from "utils/constant";

class OwnerServiceSupport extends RealtimeDatabase {
    database: Database;

    constructor(db: Database) {
        super(db);
        this.database = db;
    }

    async GetMyAssigments({ uid }: Pick<IDs, "uid">) {
        return this.ProxyRequest(async () => {
            const assignments = (await this.getAssigments({ uid })).val();
            return {
                orders: Utils.parseTreeObjectToArray(assignments?.orders),
                request: Utils.parseTreeObjectToArray(assignments?.request),
                finish: Utils.parseTreeObjectToArray(assignments?.finish),
            };
        });
    }
}

export default OwnerServiceSupport;
