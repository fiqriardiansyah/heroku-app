import { Database, get, ref, update } from "firebase/database";
import { Service, ServiceData } from "models";
import RealtimeDatabase from "services/utils/realtime-database";
import { DEFAULT_ERROR, DOCUMENTS } from "utils/constant";

class HeroServiceSupport extends RealtimeDatabase {
    database: Database;

    constructor(db: Database) {
        super(db);
        this.database = db;
    }
}

export default HeroServiceSupport;
