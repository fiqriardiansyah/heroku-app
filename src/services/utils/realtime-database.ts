import {
    Database,
    equalTo,
    get,
    onValue,
    orderByChild,
    push,
    query,
    ref,
    remove,
    startAt,
    update,
} from "firebase/database";
import {
    Application,
    Bid,
    ChatInfo,
    IDs,
    Poster,
    Service,
    ServiceData,
    ServiceOrder,
    ServiceOwnerFinish,
    ServiceOwnerOrder,
    ServiceOwnerRequest,
    ServiceRequest,
    User,
} from "models";
import moment from "moment";
import Utils from "utils";
import { DEFAULT_ERROR, DOCUMENTS } from "utils/constant";
import BaseService from "./base";

class RealtimeDatabase extends BaseService {
    db: Database;

    servDt = DOCUMENTS.services_data;

    serv = DOCUMENTS.services;

    asg = DOCUMENTS.assignment;

    pstr = DOCUMENTS.posters;

    bids = DOCUMENTS.bids;

    appl = DOCUMENTS.applications;

    users = DOCUMENTS.users;

    constructor(db: Database) {
        super();
        this.db = db;
    }

    // services documents
    getAllMyServices({ uid }: Pick<IDs, "uid">) {
        const queryRef = query(ref(this.db, this.serv), orderByChild("uid"), equalTo(uid));
        return get(queryRef);
    }

    getOneService({ sid }: Pick<IDs, "sid">) {
        return get(ref(this.db, `${this.serv}/${sid}`));
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
            if (!snapshot.exists()) {
                callback([]);
                return;
            };
            callback(Utils.parseTreeObjectToArray<ServiceData>(snapshot.val()) || []);
        });
    }

    getAllShowServiceData() {
        const queryRef = query(ref(this.db, this.servDt), orderByChild("status"), equalTo("active"))
        return get(queryRef);
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

    addServiceDataFinish({
        data,
        ...ids
    }: Pick<IDs, "sid"> & {
        data: ServiceOrder;
    }) {
        return push(ref(this.db, `${this.servDt}/${ids.sid}/finish`), data);
    }

    deleteServiceDataRequest(ids: Pick<IDs, "sid" | "rid">) {
        return remove(ref(this.db, `${this.servDt}/${ids.sid}/request/${ids.rid}`));
    }

    deleteServiceDataOrder(ids: Pick<IDs, "sid" | "rid">) {
        return remove(ref(this.db, `${this.servDt}/${ids.sid}/orders/${ids.rid}`));
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

    addAssignmentFinish({
        data,
        ...ids
    }: Pick<IDs, "uid"> & {
        data: ServiceOwnerFinish;
    }) {
        return push(ref(this.db, `${this.asg}/${ids.uid}/finish`), data);
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

    deleteAssignmentRequest({ uid, rid }: Pick<IDs, "uid" | 'rid'>) {
        const queryRef = query(ref(this.db, `${this.asg}/${uid}/request/${rid}`));
        return remove(queryRef.ref);
    }

    deleteAssignmentOrder(ids: Pick<IDs, "sid" | "uid">) {
        const queryRef = query(ref(this.db, `${this.asg}/${ids.uid}/orders`), orderByChild("sid"), equalTo(ids.sid));
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

    updatePoster({ pid, data }: Pick<IDs, "pid"> & {
        data: Partial<Poster>
    }) {
        return update(ref(this.db, `${this.pstr}/${pid}`), data);
    }

    _getAllShowPoster(callback: (data: Poster[]) => void) {
        onValue(query(ref(this.db, this.pstr), orderByChild("status"), equalTo("open")), (snapshot) => {
            if (!snapshot.exists()) {
                callback([]);
                return;
            };
            callback(Utils.parseTreeObjectToArray<Poster>(snapshot.val()).sort((a, b) => b.date - a.date) || []);
        });
    }

    getAllShowPoster() {
        const queryRef = query(ref(this.db, this.pstr), orderByChild("status"), equalTo("open"))
        return get(queryRef);
    }

    _searchShowPoster(key: string, callback: (data: Poster[]) => void) {
        const keyString = key.trim().toLocaleLowerCase();
        if (!keyString) return;
        const onSubscribe = onValue(query(ref(this.db, this.pstr), orderByChild("flag"), startAt(keyString)), (snapshot) => {
            if (!snapshot.exists()) return;
            callback(Utils.parseTreeObjectToArray<Poster>(snapshot.val()).filter((el) => el.flag?.includes(keyString)).sort((a, b) => b.date - a.date) || []);
        });
        if (!keyString) {
            onSubscribe();
        }
    }

    addBidIdToPoster({ pid, biid }: Pick<IDs, 'pid' | 'biid'>) {
        return push(ref(this.db, `${this.pstr}/${pid}/bids`), {
            biid,
        });
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
        const queryRef = query(ref(this.db, this.bids), orderByChild("uid"), equalTo(uid));
        return get(queryRef);
    }

    updateBid({ biid, data }: Pick<IDs, "biid"> & {
        data: Partial<Bid>
    }) {
        return update(ref(this.db, `${this.bids}/${biid}`), data);
    }

    posterBids({ pid }: Pick<IDs, "pid">) {
        const queryRef = query(ref(this.db, this.bids), orderByChild("pid"), equalTo(pid));
        return get(queryRef);
    }

    getBid({ biid }: Pick<IDs, "biid">) {
        return get(ref(this.db, `${this.bids}/${biid}`));
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

    updateApplication({ apcid, data }: Pick<IDs, "apcid"> & {
        data: Partial<Application>
    }) {
        return update(ref(this.db, `${this.appl}/${apcid}`), data);
    }

    myApplications({ uid }: Pick<IDs, "uid">) {
        const queryRef = query(ref(this.db, this.appl), orderByChild("uid"), equalTo(uid));
        return get(queryRef);
    }

    posterApplications({ pid }: Pick<IDs, "pid">) {
        const queryRef = query(ref(this.db, this.appl), orderByChild("pid"), equalTo(pid));
        return get(queryRef);
    }

    addApplicationIdToPoster({ pid, apcid }: Pick<IDs, 'pid' | 'apcid'>) {
        return push(ref(this.db, `${this.pstr}/${pid}/applications`), {
            apcid,
        });
    }

    getApplication({ apcid }: Pick<IDs, "apcid">) {
        return get(ref(this.db, `${this.appl}/${apcid}`));
    }

    // user
    _observeMyProfile({ uid, callback }: Pick<IDs, 'uid'> & {
        callback: (data: User) => void
    }) {
        onValue(ref(this.db, `${this.users}/${uid}`), (snapshot) => {
            callback(snapshot.val());
        });
    }

    _observeMyChats({ uid, callback }: Pick<IDs, 'uid'> & {
        callback: (data: ChatInfo[]) => void
    }) {
        onValue(query(ref(this.db, `${this.users}/${uid}/chats`), orderByChild('last_chat')), (snapshot) => {
            if (!snapshot.exists()) {
                callback([]);
            }
            callback(Utils.parseTreeObjectToArray<ChatInfo>(snapshot.val()) || []);
        });
    }

    updateInfoChatUser({ uid, cid, data }: Pick<IDs, 'uid' | 'cid'> & {
        data: ChatInfo
    }) {
        return update(ref(this.db, `${this.users}/${uid}/chats/${cid}`), data);
    }

    udpateUser(user: User) {
        return update(ref(this.db, `${this.users}/${user.uid}`), user);
    }
}

export default RealtimeDatabase;
