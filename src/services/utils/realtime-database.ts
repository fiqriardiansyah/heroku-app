import {
    child,
    Database,
    DataSnapshot,
    equalTo,
    get,
    limitToFirst,
    limitToLast,
    onValue,
    orderByChild,
    orderByKey,
    orderByValue,
    push,
    query,
    ref,
    remove,
    startAt,
    update,
} from "firebase/database";
import {
    Assignments,
    IDs,
    Poster,
    Service,
    ServiceData,
    ServiceOrder,
    ServiceOwnerOrder,
    ServiceOwnerRequest,
    ServiceRequest,
} from "models";
import moment from "moment";
import Utils from "utils";
import { DEFAULT_ERROR, DOCUMENTS } from "utils/constant";

class RealtimeDatabase {
    db: Database;

    servDt = DOCUMENTS.services_data;

    serv = DOCUMENTS.services;

    asg = DOCUMENTS.assignment;

    pstr = DOCUMENTS.posters;

    constructor(db: Database) {
        this.db = db;
    }

    async ProxyRequest<T>(request: () => Promise<T>): Promise<T> {
        try {
            return request();
        } catch (error: any) {
            const message = error?.message || DEFAULT_ERROR;
            throw new Error(message);
        }
    }

    // services documents
    async GetServices({ uid }: Pick<IDs, "uid">): Promise<Service[]> {
        const services = (await get(ref(this.db, `${this.serv}/${uid}`))).val();
        return Utils.parseTreeObjectToArray<Service>(services);
    }

    async GetService(ids: Pick<IDs, "sid" | "hid">): Promise<Service> {
        return (
            await get(ref(this.db, `${this.serv}/${ids.hid}/${ids.sid}`))
        ).val();
    }

    async AddService({
        data,
        ...ids
    }: Pick<IDs, "uid" | "sid"> & {
        data: Service;
    }) {
        await update(ref(this.db, `${this.serv}/${ids.uid}/${ids.sid}`), data);
        return true;
    }

    // services_data documents
    async GetServicesData({ uid }: Pick<IDs, "uid">): Promise<ServiceData[]> {
        const services = (
            await get(ref(this.db, `${this.servDt}/${uid}`))
        ).val();
        return Utils.parseTreeObjectToArray<ServiceData>(services);
    }

    async GetServiceData(ids: Pick<IDs, "sid" | "hid">): Promise<ServiceData> {
        return (
            await get(ref(this.db, `${this.servDt}/${ids.hid}/${ids.sid}`))
        ).val();
    }

    async AddServiceDataRequest({
        data,
        ...ids
    }: Pick<IDs, "uid" | "sid"> & {
        data: ServiceRequest;
    }) {
        return (
            await push(
                ref(this.db, `${this.servDt}/${ids.uid}/${ids.sid}/request`),
                data
            )
        ).ref;
    }

    async AddServiceData({
        data,
        ...ids
    }: Pick<IDs, "uid" | "sid"> & {
        data: ServiceData;
    }) {
        await update(
            ref(this.db, `${this.servDt}/${ids.uid}/${ids.sid}`),
            data
        );
        return true;
    }

    async AddServiceDataOrder({
        data,
        ...ids
    }: Pick<IDs, "uid" | "sid"> & {
        data: ServiceOrder;
    }) {
        await push(
            ref(this.db, `${this.servDt}/${ids.uid}/${ids.sid}/orders`),
            data
        );
        return true;
    }

    async DeleteServiceDataRequest(ids: Pick<IDs, "sid" | "uid" | "rid">) {
        return remove(
            ref(
                this.db,
                `${this.servDt}/${ids.uid}/${ids.sid}/request/${ids.rid}`
            )
        );
    }

    async UpdateServiceDataOrder({
        data,
        ...ids
    }: Pick<IDs, "sid" | "uid" | "oid"> & {
        data: ServiceOrder;
    }) {
        return update(
            ref(
                this.db,
                `${this.servDt}/${ids.uid}/${ids.sid}/orders/${ids.oid}`
            ),
            data
        );
    }

    // assignments documents
    async AddAssignmentRequest({
        data,
        ...ids
    }: Pick<IDs, "uid"> & {
        data: ServiceOwnerRequest;
    }) {
        return (
            await push(ref(this.db, `${this.asg}/${ids.uid}/request`), data)
        ).ref;
    }

    async UpdateAssignmentOrder({
        uid,
        data,
    }: Pick<IDs, "uid"> & {
        data: ServiceOwnerOrder;
    }) {
        return update(
            ref(this.db, `${this.asg}/${uid}/orders/${data.id}`),
            data
        );
    }

    async GetAssigments({ uid }: Pick<IDs, "uid">): Promise<Assignments> {
        const assignments = (
            await get(ref(this.db, `${this.asg}/${uid}`))
        ).val();
        return {
            orders: Utils.parseTreeObjectToArray(assignments?.orders),
            request: Utils.parseTreeObjectToArray(assignments?.request),
            finish: Utils.parseTreeObjectToArray(assignments?.finish),
        };
    }

    async GetOneAssignmentRequest({ uid, sid }: Pick<IDs, "uid" | "sid">) {
        const requests = (
            await get(ref(this.db, `${this.asg}/${uid}/request`))
        ).val();
        const request = Utils.parseTreeObjectToArray<ServiceOwnerRequest>(
            requests
        )?.find((el) => el.sid === sid);
        return request;
    }

    async GetOneAssignmentOrder({
        uid,
        sid,
        date,
    }: Pick<IDs, "uid" | "sid"> & { date: number }) {
        const orders = (
            await get(ref(this.db, `${this.asg}/${uid}/orders`))
        ).val();
        const order = Utils.parseTreeObjectToArray<ServiceOwnerOrder>(
            orders
        )?.find((el) => el.sid === sid && el.date === date);
        return order;
    }

    async UpdateAssignmentRequest({
        data,
        ...ids
    }: Pick<IDs, "uid" | "rid"> & {
        data: ServiceOwnerRequest;
    }) {
        return update(
            ref(this.db, `${this.asg}/${ids.uid}/request/${ids.rid}`),
            data
        );
    }

    async AddAssignmentOrder({
        uid,
        data,
    }: Pick<IDs, "uid"> & {
        data: ServiceOwnerOrder;
    }) {
        return push(ref(this.db, `${this.asg}/${uid}/orders`), data);
    }

    async DeleteAssignmentRequest(ids: Pick<IDs, "sid" | "uid">) {
        const queryRef = query(
            ref(this.db, `${this.asg}/${ids.uid}/request`),
            orderByChild("sid"),
            equalTo(ids.sid)
        );
        return remove(queryRef.ref);
    }

    // posters
    _addPoster({
        pid,
        data,
    }: Pick<IDs, "pid"> & {
        data: Poster;
    }) {
        return update(ref(this.db, `${this.pstr}/${pid}`), data);
    }

    async GetAllPoster() {
        const posters: Poster[] = [];
        onValue(
            query(
                ref(this.db, this.pstr),
                orderByChild("status"),
                equalTo("close")
            ),
            (snapshot) => {
                if (snapshot.exists()) {
                    posters.push(
                        ...Utils.parseTreeObjectToArray<Poster>(snapshot.val())
                    );
                }
            }
        );
        return posters;
    }
}

export default RealtimeDatabase;
