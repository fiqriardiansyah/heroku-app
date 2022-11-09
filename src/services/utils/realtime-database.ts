import {
    child,
    Database,
    DataSnapshot,
    endAt,
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
    serverTimestamp,
    startAt,
    update,
} from "firebase/database";
import {
    Application,
    Assignments,
    Bid,
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

    bids = DOCUMENTS.bids;

    appl = DOCUMENTS.applications;

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
    getAllMyServices({ uid }: Pick<IDs, "uid">) {
        const queryRef = query(ref(this.db, this.serv), orderByChild("uid"), equalTo(uid));
        return get(queryRef);
    }

    getOneService(ids: Pick<IDs, "sid">) {
        return get(ref(this.db, `${this.serv}/${ids.sid}`));
    }

    addService({
        data,
        ...ids
    }: Pick<IDs, "uid" | "sid"> & {
        data: Service;
    }) {
        return update(ref(this.db, `${this.serv}/${ids.sid}`), data);
    }

    deleteService({ sid }: Pick<IDs, "sid">) {
        return remove(ref(this.db, `${this.serv}/${sid}`));
    }

    // services_data documents
    getAllMyServicesData({ uid }: Pick<IDs, "uid">) {
        const queryRef = query(ref(this.db, this.servDt), orderByChild("uid"), equalTo(uid));
        return get(queryRef);
    }

    _getAllShowServicesData(callback: (data: ServiceData[]) => void) {
        onValue(query(ref(this.db, this.servDt), orderByChild("status"), equalTo("active")), (snapshot) => {
            if (!snapshot.exists()) return;
            callback(Utils.parseTreeObjectToArray<ServiceData>(snapshot.val()) || []);
        });
    }

    _searchShowServicesData(key: string, callback: (data: ServiceData[]) => void) {
        const keyString = key.trim().toLocaleLowerCase();
        if (!keyString) return;
        const onSubscribe = onValue(query(ref(this.db, this.servDt), orderByChild("flag"), startAt(keyString)), (snapshot) => {
            if (!snapshot.exists()) return;
            callback(Utils.parseTreeObjectToArray<ServiceData>(snapshot.val()).filter((el) => el.flag?.includes(keyString)) || []);
        });
        if (!keyString) {
            onSubscribe();
        }
    }

    deleteServiceData({ sid }: Pick<IDs, "sid">) {
        return remove(ref(this.db, `${this.servDt}/${sid}`));
    }

    getOneServiceData(ids: Pick<IDs, "sid">) {
        return get(ref(this.db, `${this.servDt}/${ids.sid}`));
    }

    addServiceDataRequest({
        data,
        ...ids
    }: Pick<IDs, "sid"> & {
        data: ServiceRequest;
    }) {
        return push(ref(this.db, `${this.servDt}/${ids.sid}/request`), data);
    }

    addServiceData({
        data,
        ...ids
    }: Pick<IDs, "sid"> & {
        data: ServiceData;
    }) {
        return update(ref(this.db, `${this.servDt}/${ids.sid}`), data);
    }

    addServiceDataOrder({
        data,
        ...ids
    }: Pick<IDs, "sid"> & {
        data: ServiceOrder;
    }) {
        return push(ref(this.db, `${this.servDt}/${ids.sid}/orders`), data);
    }

    deleteServiceDataRequest(ids: Pick<IDs, "sid" | "rid">) {
        return remove(ref(this.db, `${this.servDt}/${ids.sid}/request/${ids.rid}`));
    }

    updateServiceDataOrder({
        data,
        ...ids
    }: Pick<IDs, "sid" | "oid"> & {
        data: ServiceOrder;
    }) {
        return update(ref(this.db, `${this.servDt}/${ids.sid}/orders/${ids.oid}`), data);
    }

    // assignments documents
    addAssignmentRequest({
        data,
        ...ids
    }: Pick<IDs, "uid"> & {
        data: ServiceOwnerRequest;
    }) {
        return push(ref(this.db, `${this.asg}/${ids.uid}/request`), data);
    }

    updateAssignmentOrder({
        uid,
        data,
    }: Pick<IDs, "uid"> & {
        data: ServiceOwnerOrder;
    }) {
        return update(ref(this.db, `${this.asg}/${uid}/orders/${data.id}`), data);
    }

    getAssigments({ uid }: Pick<IDs, "uid">) {
        return get(ref(this.db, `${this.asg}/${uid}`));
    }

    getAssignmentRequests({ uid }: Pick<IDs, "uid">) {
        return get(ref(this.db, `${this.asg}/${uid}/request`));
    }

    getAssignmentOrders({ uid }: Pick<IDs, "uid">) {
        return get(ref(this.db, `${this.asg}/${uid}/orders`));
    }

    updateAssignmentRequest({
        data,
        ...ids
    }: Pick<IDs, "uid" | "rid"> & {
        data: ServiceOwnerRequest;
    }) {
        return update(ref(this.db, `${this.asg}/${ids.uid}/request/${ids.rid}`), data);
    }

    addAssignmentOrder({
        uid,
        data,
    }: Pick<IDs, "uid"> & {
        data: ServiceOwnerOrder;
    }) {
        return push(ref(this.db, `${this.asg}/${uid}/orders`), data);
    }

    deleteAssignmentRequest(ids: Pick<IDs, "sid" | "uid">) {
        const queryRef = query(ref(this.db, `${this.asg}/${ids.uid}/request`), orderByChild("sid"), equalTo(ids.sid));
        return remove(queryRef.ref);
    }

    // posters
    addPoster({
        pid,
        data,
    }: Pick<IDs, "pid"> & {
        data: Poster;
    }) {
        return update(ref(this.db, `${this.pstr}/${pid}`), data);
    }

    myPosters({ uid }: Pick<IDs, "uid">) {
        const queryRef = query(ref(this.db, this.pstr), orderByChild("uid"), equalTo(uid));
        return get(queryRef);
    }

    getOnePoster({ pid }: Pick<IDs, "pid">) {
        return get(ref(this.db, `${this.pstr}/${pid}`));
    }

    _getAllShowPoster(callback: (data: Poster[]) => void) {
        onValue(query(ref(this.db, this.pstr), orderByChild("status"), equalTo("open")), (snapshot) => {
            if (!snapshot.exists()) return;
            callback(Utils.parseTreeObjectToArray<Poster>(snapshot.val()) || []);
        });
    }

    _searchShowPoster(key: string, callback: (data: Poster[]) => void) {
        const keyString = key.trim().toLocaleLowerCase();
        if (!keyString) return;
        const onSubscribe = onValue(query(ref(this.db, this.pstr), orderByChild("flag"), startAt(keyString)), (snapshot) => {
            if (!snapshot.exists()) return;
            callback(Utils.parseTreeObjectToArray<Poster>(snapshot.val()).filter((el) => el.flag?.includes(keyString)) || []);
        });
        if (!keyString) {
            onSubscribe();
        }
    }

    // bids
    addBids({
        data,
        biid,
    }: Pick<IDs, "biid"> & {
        data: Bid;
    }) {
        return update(ref(this.db, `${this.bids}/${biid}`), data);
    }

    myBids({ uid }: Pick<IDs, "uid">) {
        const queryRef = query(ref(this.db, this.bids), orderByChild("hid"), equalTo(uid));
        return get(queryRef);
    }

    // aplications
    addApplications({
        data,
        apcid,
    }: Pick<IDs, "apcid"> & {
        data: Application;
    }) {
        return update(ref(this.db, `${this.appl}/${apcid}`), data);
    }

    myApplications({ uid }: Pick<IDs, "uid">) {
        const queryRef = query(ref(this.db, this.appl), orderByChild("hid"), equalTo(uid));
        return get(queryRef);
    }
}

export default RealtimeDatabase;
