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
            const id = uuidv4();
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
                    status,
                    viewed: 0,
                    poster_image: service.images[0],
                    title: service.title,
                    flag: `${service.title} ${service.category} ${service.tags?.join(' ')}`
                }, sid: id,
            });
            return id;
        })
    }

    async GetDetailService({ sid, uid }: { sid: string; uid: string }) {
        return this.ProxyRequest(async () => {
            const services = await (await this.getOneService({ sid })).val();
            const servicesData = await (await this.getOneServiceData({ sid })).val();
            return { ...services, ...servicesData } as ServiceDetail;
        });
    }

    async AcceptRequestService({
        sid,
        uid,
        request,
    }: {
        uid: string;
        sid: string;
        request: ServiceRequest;
    }) {
        return this.ProxyRequest(async () => {
            const date = serverTimestamp();
            await this.addServiceDataOrder({
                data: {
                    uid: request.uid,
                    date,
                    status: 0,
                },
                sid,
            })
            await this.addAssignmentOrder({
                data: {
                    sid,
                    uid,
                    date,
                    status: 0,
                },
                uid: request.uid,
            })
            await this.deleteAssignmentRequest({ sid, uid: request.uid });
            await this.deleteServiceDataRequest({ sid, rid: request.id as any });
            return date;
        });
    }

    async DeclineRequestService({
        sid,
        uid,
        request,
    }: {
        uid: string;
        sid: string;
        request: ServiceRequest;
    }) {
        return this.ProxyRequest(async () => {
            await this.deleteServiceDataRequest({ sid, rid: request.id as any })
            const requestData = await this.GetOneAssignmentRequest({ uid: request.uid, sid });
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
        uid,
        order,
    }: {
        uid: string;
        sid: string;
        order: ServiceOrder;
    }) {
        return this.ProxyRequest(async () => {
            const date = serverTimestamp();
            await this.updateServiceDataOrder({
                sid,
                oid: order.id as any,
                data: {
                    ...order,
                    status: order.status + 1,
                    progress: !order.progress ? [{
                        status: order.status + 1,
                        date,
                    }] : [...order.progress, {
                        status: order.status + 1,
                        date,
                    }]
                }
            })
            const orderData = await this.GetOneAssignmentOrder({ uid: order.uid as any, sid, date: order.date });
            if (!orderData) {
                throw new Error('assignment order not found!');
            }
            await this.updateAssignmentOrder({
                uid: order.uid as any,
                data: {
                    ...orderData,
                    status: orderData.status + 1,
                    progress: !orderData.progress ? [{
                        status: orderData.status + 1,
                        date,
                    }] : [...orderData.progress, {
                        status: orderData.status + 1,
                        date,
                    }]
                }
            })
            return null;
        });
    }

    async DeleteMyService(service: ServiceDetail) {
        if (!service) {
            throw new Error("Service can't empty");
        }
        return this.ProxyRequest(async () => {
            if (service.request?.length === 0 && service.orders?.length === 0) {
                await this.deleteService({ sid: service.id as any });
                await this.deleteServiceData({ sid: service.id as any });
                return true;
            }
            throw new Error("There is still activity,  Can't remove this service");
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

    async GetAllMyApplication({ uid }: Pick<IDs, "uid">) { // myjob - contracts
        return this.ProxyRequest(async () => {
            const bids = await this.myApplications({ uid });
            return Utils.parseTreeObjectToArray<Application>(bids.val()) || [];
        });
    }
}

const heroService = new HeroService({ config: configFirebase.app, database: getDatabase(configFirebase.app) });
export default heroService;
