/* eslint-disable max-classes-per-file */
/* eslint-disable prettier/prettier */
import configFirebase from "config/firebase";
import { v4 as uuidv4 } from "uuid";
import { FirebaseApp } from "firebase/app";
import {
    Database,
    getDatabase,
} from "firebase/database";
import {
    Service,
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

    async CreateService({ service, uid }: { service: Service; uid: string }) {
        return this.ProxyRequest(async () => {
            const id = uuidv4();
            await this.AddService({ data: service, uid, sid: id });
            await this.AddServiceData({
                data: {
                    id,
                    uid,
                    post_date: new Date().getTime(),
                    status: "active",
                    viewed: 0,
                    poster_image: service.images[0],
                    title: service.title,
                }, sid: id, uid
            });
            return id;
        })
    }

    async GetDetailService({ sid, uid }: { sid: string; uid: string }) {
        return this.ProxyRequest(async () => {
            const services = await this.GetService({ sid, hid: uid });
            const servicesData = await this.GetServiceData({ sid, hid: uid });
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
            const date = new Date().getTime();
            await this.AddServiceDataOrder({
                data: {
                    uid: request.uid,
                    date,
                    status: 0,
                }, uid, sid,
            })
            this.AddAssignmentOrder({
                data: {
                    sid,
                    uid,
                    date,
                    status: 0,
                },
                uid: request.uid,
            })
            await this.DeleteAssignmentRequest({ sid, uid: request.uid });
            await this.DeleteServiceDataRequest({ sid, uid, rid: request.id as any });
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
            await this.DeleteServiceDataRequest({ uid, sid, rid: request.id as any })
            const requestData = await this.GetOneAssignmentRequest({ uid: request.uid, sid });
            if (!requestData) {
                throw new Error('request data not found!');
            }
            await this.UpdateAssignmentRequest({
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
            const date = new Date().getTime();
            await this.UpdateServiceDataOrder({
                uid, sid, oid: order.id as any, data: {
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
            await this.UpdateAssignmentOrder({
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

}

const heroService = new HeroService({ config: configFirebase.app, database: getDatabase(configFirebase.app) });
export default heroService;
