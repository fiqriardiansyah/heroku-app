/* eslint-disable max-classes-per-file */
/* eslint-disable prettier/prettier */
import configFirebase from "config/firebase";
import { v4 as uuidv4 } from "uuid";
import { FirebaseApp } from "firebase/app";
import {
    Database,
    getDatabase,
    serverTimestamp,
} from "firebase/database";
import {
    Application,
    Bid,
    IDs,
    Poster,
    Service,
    ServiceData,
    ServiceDetail,
    ServiceOrder,
    ServiceRequest,
} from "models";
import { DEFAULT_ERROR } from "utils/constant";
import Utils from "utils";
import HeroServiceSupport from "./support/hero";

class HeroService extends HeroServiceSupport {
    config: FirebaseApp;

    database: Database;

    constructor({ config, database }: { config: FirebaseApp, database: Database }) {
        super(database);
        this.config = config;
        this.database = database;
    }

    async CreateService({ service, uid, status }: { service: Service; uid: string, status: ServiceData['status'] }) {
        return this.ProxyRequest(async () => {
            const id = service?.id || uuidv4();
            await this.addService({
                data: {
                    ...service,
                    uid,
                    id,
                },
                uid,
                sid: id
            });
            await this.addServiceData({
                data: {
                    id,
                    uid,
                    post_date: serverTimestamp(),
                    price: service.price,
                    status,
                    viewed: 0,
                    poster_image: service?.images ? service?.images[0] : '',
                    title: service.title,
                    flag: `${service.title} ${service.category} ${service.tags?.join(' ')}`
                }, sid: id,
            });
            return id;
        })
    }

    async SearchPoster(key: string) {
        return this.ProxyRequest(async () => {
            const req = await this.getAllShowPoster();
            const posters = Utils.parseTreeObjectToArray<Poster>(req.val() || {});
            return posters.filter((poster) => poster.flag?.includes(key));
        });
    }

    async GetDetailService({ sid }: { sid: string }) {
        return this.ProxyRequest(async () => {
            const service = await (await this.getOneService({ sid })).val();
            const serviceData = await (await this.getOneServiceData({ sid })).val();
            if (!service || !serviceData) {
                throw new Error(`Service width id ${sid} not found`);
            }
            return { ...service, ...serviceData } as ServiceDetail;
        });
    }

    async AcceptRequestService({
        sid,
        uid,
        hid,
        request,
    }: Pick<IDs, 'sid' | 'uid' | 'hid'> & {
        request: ServiceRequest
    }) {
        return this.ProxyRequest(async () => {
            const date = serverTimestamp();
            const assignmentReq = await this.GetOneAssignmentRequest({ key: request?.key as any, uid })
            if (!assignmentReq) {
                throw new Error("Assignment request not found")
            }
            await this.addServiceDataOrder({
                data: { hid, uid: request.uid, date, status: 0 },
                sid,
            })
            await this.addAssignmentOrder({
                data: { hid, sid, uid, date, status: 0 },
                uid: request.uid,
            })
            await this.deleteAssignmentRequest({ rid: assignmentReq.id as any, uid: request.uid });
            await this.deleteServiceDataRequest({ sid, rid: request.id as any });
            return date;
        });
    }

    async DeclineRequestService({
        sid,
        request,
    }: {
        sid: string;
        request: ServiceRequest;
    }) {
        return this.ProxyRequest(async () => {
            await this.deleteServiceDataRequest({ sid, rid: request.id as any })
            const requestData = await this.GetOneAssignmentRequest({ uid: request.uid, key: request?.key as any });
            if (!requestData) {
                throw new Error('request data not found!');
            }
            await this.updateAssignmentRequest({
                data: {
                    ...requestData,
                    status: "rejected",
                }, uid: request.uid, rid: requestData?.id as any
            })
            return null;
        })
    }

    async SetJourneyServiceOrder({
        sid,
        order,
        urlFile,
    }: {
        sid: string;
        order: ServiceOrder;
        urlFile: string;
    }) {
        return this.ProxyRequest(async () => {
            const date = serverTimestamp();
            const orderData = await this.GetOneAssignmentOrder({ uid: order.uid as any, sid });
            if (!orderData) {
                throw new Error('assignment order not found!');
            }
            await Promise.all([
                this.updateServiceDataOrder({
                    sid,
                    oid: order.id as any,
                    data: {
                        ...order,
                        status: order.status + 1,
                        progress: !order.progress ? [{
                            status: 0,
                            date,
                        }] : [...order.progress, {
                            status: order.status + 1,
                            date,
                        }],
                        files: !order.files ? [urlFile] : [...order.files, urlFile]
                    }
                }), this.updateAssignmentOrder({
                    uid: order.uid as any,
                    data: {
                        ...orderData,
                        status: orderData.status + 1,
                        progress: !orderData.progress ? [{
                            status: 0,
                            date,
                        }] : [...orderData.progress, {
                            status: orderData.status + 1,
                            date,
                        }],
                        files: !order.files ? [urlFile] : [...order.files, urlFile]
                    }
                })])
            return null;
        });
    }

    async SetJourneyPoster({
        data,
        urlFile,
    }: {
        data: Bid;
        urlFile: string;
    }) {
        return this.ProxyRequest(async () => {
            const date = serverTimestamp();
            await this.updateBid({
                biid: data.id as any, data: {
                    ...data,
                    status: data.status! + 1,
                    progress: !data.progress ? [{
                        status: 0,
                        date,
                    }] : [...data.progress, {
                        status: data.status! + 1,
                        date,
                    }],
                    files: !data.files ? [urlFile] : [...data.files, urlFile]
                }
            });
            return null;
        });
    }

    async DeleteMyService(id: string) {
        if (!id) {
            throw new Error("Service can't empty");
        }
        return this.ProxyRequest(async () => {
            await this.deleteService({ sid: id });
            await this.deleteServiceData({ sid: id });
            return true;
        });
    }

    async CreateBid(data: Bid) {
        return this.ProxyRequest(async () => {
            const id = uuidv4();
            this.addBids({
                biid: id,
                data: {
                    ...data,
                    id,
                    date: serverTimestamp(),
                }
            });
            return id;
        });
    }

    async CreateApplication(data: Application) {
        return this.ProxyRequest(async () => {
            const id = uuidv4();
            this.addApplications({
                apcid: id,
                data: {
                    ...data,
                    id,
                    date: serverTimestamp(),
                }
            });
            return id;
        });
    }

    async GetAllMyBid({ uid }: Pick<IDs, "uid">) { // myjob - bidding
        return this.ProxyRequest(async () => {
            const bids = await this.myBids({ uid });
            return Utils.parseTreeObjectToArray<Bid>(bids.val()) || [];
        });
    }

    async GetMyBidInPoster({ uid, pid }: Pick<IDs, "uid" | "pid">) {
        return this.ProxyRequest(async () => {
            const bid = await this.myBids({ uid });
            const bids = Utils.parseTreeObjectToArray<Bid>(bid.val()) || [];
            return bids.find((bd) => bd.pid === pid);
        });
    }

    async GetPosterBid({ pid }: Pick<IDs, "pid">) {
        return this.ProxyRequest(async () => {
            const bid = await this.posterBids({ pid });
            const bids = Utils.parseTreeObjectToArray<Bid>(bid.val()) || [];
            return bids
        });
    }

    async GetPosterApplication({ pid }: Pick<IDs, "pid">) { // myjob - apply
        return this.ProxyRequest(async () => {
            const bid = await this.posterApplications({ pid });
            const bids = Utils.parseTreeObjectToArray<Application>(bid.val()) || [];
            return bids
        });
    }

    async GetAllMyApplication({ uid }: Pick<IDs, "uid">) { // myjob - contracts
        return this.ProxyRequest(async () => {
            const bids = await this.myApplications({ uid });
            return Utils.parseTreeObjectToArray<Application>(bids.val()) || [];
        });
    }

    async SendBid({ pid, uid, data }: Pick<IDs, 'pid' | 'uid'> & { data: Bid }) {
        return this.ProxyRequest(async () => {
            const id = uuidv4();
            const bids = await this.GetPosterBid({ pid });
            const alreadyBid = bids.find((bid) => bid.uid === uid);
            if (alreadyBid) {
                throw new Error("You already bid this post");
            }
            const newData: Bid = {
                ...data,
                id,
                pid,
                uid,
                date: serverTimestamp(),
                accept: false,
                status: 0,
            }
            await this.addBids({ data: newData, biid: id });
            await this.addBidIdToPoster({ pid, biid: id });
            return null
        });
    }

    async SendApplication({ pid, uid, data }: Pick<IDs, 'pid' | 'uid'> & { data: Application }) {
        return this.ProxyRequest(async () => {
            const id = uuidv4();
            const appplications = await this.GetPosterApplication({ pid });
            const alreadyApply = appplications.find((app) => app.uid === uid);
            if (alreadyApply) {
                throw new Error("You already apply this post");
            }
            const newData: Application = {
                ...data,
                id,
                pid,
                uid,
                date: serverTimestamp(),
                accept: false,
            }
            await this.addApplications({ data: newData, apcid: id });
            await this.addApplicationIdToPoster({ pid, apcid: id });
            return null
        });
    }

    async GetOnePoster({ pid }: Pick<IDs, "pid">) {
        return this.ProxyRequest(async () => {
            return (await this.getOnePoster({ pid })).val() as Poster;
        })
    }

}

const heroService = new HeroService({ config: configFirebase.app, database: getDatabase(configFirebase.app) });
export default heroService;
