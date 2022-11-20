import { v4 as uuidv4 } from "uuid";
import configFirebase from "config/firebase";
import { FirebaseApp } from "firebase/app";
import { Database, get, getDatabase, push, query, ref, set, serverTimestamp } from "firebase/database";
import { Application, Bid, IDs, Poster, Service, ServiceData, ServiceDetail, ServiceOwnerOrder, ServiceOwnerRequest, ServiceRequest } from "models";
import { DEFAULT_ERROR, DOCUMENTS } from "utils/constant";
import Utils from "utils";
import OwnerServiceSupport from "./support/owner";
import heroService from "./hero";

class OwnerService extends OwnerServiceSupport {
    config: FirebaseApp;

    database: Database;

    constructor({ config, database }: { config: FirebaseApp; database: Database }) {
        super(database);
        this.config = config;
        this.database = database;
    }

    async GetOneService({ sid }: Pick<IDs, "sid">) {
        return this.ProxyRequest(async () => {
            const service = await this.getOneService({ sid });
            return service.val() as Service;
        });
    }

    async GetDetailService({ sid }: Pick<IDs, "sid">) {
        return this.ProxyRequest(async () => {
            return {
                ...(await this.getOneService({ sid })).val(),
                ...(await this.getOneServiceData({ sid })).val(),
            } as unknown as ServiceDetail;
        });
    }

    async OrderService({ sid, uid, hid }: Pick<IDs, "sid" | "uid" | "hid">) {
        return this.ProxyRequest(async () => {
            const date = serverTimestamp();
            const key = uuidv4();
            const assignments = await this.GetMyAssigments({ uid: uid as any });
            const waitingForRequest = assignments.request?.find((req) => req.sid === sid && req.status === 'waiting');
            const orderProcess = assignments.orders?.find((order) => order.sid === sid);
            if (waitingForRequest) {
                throw new Error("You have already made a request for this service");
            }
            if (orderProcess) {
                throw new Error("Your previous order has not been completed");
            }
            await this.addServiceDataRequest({
                sid,
                data: { hid, uid, date, key },
            });
            await this.addAssignmentRequest({
                uid,
                data: { sid, uid: hid, date, status: "waiting", key },
            });
            return date;
        });
    }

    async CreatePoster({
        uid,
        data,
    }: Pick<IDs, "uid"> & {
        data: Poster;
    }) {
        return this.ProxyRequest(async () => {
            const id = uuidv4();
            await this.addPoster({
                pid: id,
                data: {
                    id,
                    uid,
                    date: serverTimestamp(),
                    status: "open",
                    flag: `${data.title} ${data.skills?.join(" ")} ${data.category}`,
                    ...data,
                },
            });
            return id;
        });
    }

    async GetAllMyPoster({ uid }: Pick<IDs, "uid">) {
        return this.ProxyRequest(async () => {
            const posters = await this.myPosters({ uid });
            return Utils.parseTreeObjectToArray<Poster>(posters.val());
        });
    }

    async DetailPoster({ pid }: Pick<IDs, "pid">) {
        return this.ProxyRequest(async () => {
            const req = await this.getOnePoster({ pid });
            return req.val() as Poster;
        });
    }

    async SearchService(key: string) {
        return this.ProxyRequest(async () => {
            const req = await this.getAllShowServiceData();
            const services = Utils.parseTreeObjectToArray<ServiceData>(req.val() || {});
            return services.filter((service) => service.flag?.includes(key));
        });
    }

    async ApproveOrderService({
        uid,
        order,
    }: Pick<IDs, 'uid'> & {
        order: ServiceOwnerOrder;
    }) {
        return this.ProxyRequest(async () => {
            const date = serverTimestamp();
            const orderData = await this.GetOneServiceOrder({ sid: order.sid, uid });
            if (!orderData) {
                throw new Error('assignment order not found!');
            }
            await Promise.all([
                this.addServiceDataFinish({
                    sid: order.sid,
                    data: {
                        ...orderData,
                        status: orderData.status + 1,
                        progress: [...orderData!.progress!, {
                            status: orderData.status + 1,
                            date,
                        }],
                    }
                }), this.addAssignmentFinish({
                    uid: uid as any,
                    data: {
                        ...order,
                        status: order.status + 1,
                        progress: [...order!.progress!, {
                            status: order.status + 1,
                            date,
                        }],
                    }
                })])
            await Promise.all([
                this.deleteAssignmentOrder({ sid: order.sid, uid }),
                this.deleteServiceDataOrder({ rid: orderData.id as any, sid: order.sid })
            ]);
            return null;
        });
    }

    async ApproveTaskPoster({ data }: { data: Bid }) {
        return this.ProxyRequest(async () => {
            await heroService.SetJourneyPoster({ data, urlFile: '' });
            // [IMPORTANT] pekerjaan selesai, pindahkan uang ke hero
            return null;
        });
    }

    async GetOneBid({ biid }: Pick<IDs, "biid">) {
        return this.ProxyRequest(async () => {
            return (await this.getBid({ biid })).val() as Bid;
        })
    }

    async GetOneApplication({ apcid }: Pick<IDs, "apcid">) {
        return this.ProxyRequest(async () => {
            return (await this.getApplication({ apcid })).val() as Application;
        })
    }

    async AcceptBidHero({ biid, data }: Pick<IDs, "biid"> & {
        data: Poster
    }) {
        return this.ProxyRequest(async () => {
            await this.updateBid({
                biid, data: {
                    accept: true
                }
            });
            await this.updatePoster({
                pid: data.id as any, data: {
                    ...data,
                    accepted_hero: data.accepted_hero ? data.accepted_hero + 1 : 1
                }
            })
            return null;
        })
    }

    async SendOffering({ apcid, application, poster }: Pick<IDs, "apcid"> & {
        application: Partial<Application>;
        poster: Poster;
    }) {
        return this.ProxyRequest(async () => {
            const date = serverTimestamp();
            await this.updateApplication({
                apcid, data: {
                    ...application,
                    offering_date: date,
                    accept: true,
                }
            });
            await this.updatePoster({
                pid: poster.id as any,
                data: {
                    ...poster,
                    accepted_hero: poster.accepted_hero ? poster.accepted_hero + 1 : 1
                }
            })
            return null;
        });
    }
}

const ownerService = new OwnerService({
    config: configFirebase.app,
    database: getDatabase(configFirebase.app),
});
export default ownerService;
