import { serverTimestamp } from "firebase/database";
import { StorageError, UploadTask } from "firebase/storage";

export interface IDs {
    uid: string; // user id
    uid2: string; // other user id
    sid: string; // service id
    hid: string; // hero id
    oid: string; // order id
    rid: string; // request id
    pid: string; // poster id
    biid: string; // bid id
    apcid: string; // aplication id;
    anyid: string; // any other id;
    cid: string; // chat id
    mid: string; // message id
}
export interface SignUpEmail {
    name: string;
    email: string;
    password: string;
}

export interface SignInEmail {
    email: string;
    password: string;
}

export interface Service {
    id?: string;
    uid?: string;
    title: string;
    category: string;
    sub_category: string;
    price: string | number;
    tags: string[];
    description: string;
    images: string[];
    pdfs: string[];
}

export interface ServiceRequest extends Pick<IDs, 'uid' | 'hid'> {
    id?: string;
    date: any;
    key?: string;
}

export interface ServiceOrder extends Pick<IDs, 'uid' | 'hid'> {
    id?: string;
    date: any;
    status: number;
    progress?: {
        status: number;
        date: any;
    }[];
    files?: string[];
}

export interface ServiceFinish extends ServiceOrder { }

export interface ServiceData {
    id?: string;
    uid?: string;
    post_date: any;
    poster_image: string;
    price: string | number;
    title: string;
    status: "active" | "draft";
    flag?: string;
    finish?: string[];
    orders?: ServiceOrder[];
    request?: ServiceRequest[];
    viewed?: number;
}

export interface ServiceOwnerRequest extends Pick<IDs, 'uid' | 'sid'> {
    id?: string;
    date: any;
    status: "waiting" | "rejected";
    key?: string;
}

export interface ServiceOwnerOrder extends Pick<IDs, 'uid' | 'hid' | 'sid'> {
    id?: string;
    heroId?: string;
    date: any;
    status: number;
    files?: string[];
    progress?: {
        status: number;
        date: any;
    }[];
}

export interface ServiceOwnerFinish extends ServiceOwnerOrder { }

export interface ServiceDetail extends Service, ServiceData {
    _?: any;
}

export interface User {
    uid: string;
    name: string;
    profile: string;
    profession?: string;
    services?: string[];
    chats?: string[];
}

export interface Assignments {
    orders: ServiceOwnerOrder[];
    request: ServiceOwnerRequest[];
    finish: any[];
}


export interface Bid extends Pick<IDs, "pid" | "hid" | "uid"> {
    id?: string;
    uid: string;
    pid: string;
    date: any;
    letter: string;
    price: string;
    accept: boolean;
    status?: number;
    files?: string[];
    progress?: {
        status: number;
        date: any;
    }[];
}

export interface Application extends Pick<IDs, "pid" | "hid" | "uid"> {
    id?: string;
    date: any;
    cv?: string;
    description: string;
    accept: boolean;
    files?: string[];
    offering_letter?: string;
    offering_date?: any;
}

export interface Poster {
    id?: string;
    uid?: string;
    title: string;
    type_of_job: "task" | "hiring";
    company?: string;
    price?: string | number;
    is_fixed_price?: boolean;
    description: string;
    category: string;
    skills: string[];
    number_of_hero?: number;
    accepted_hero?: number;
    limit_applicant?: number;
    bids?: { biid: string }[];
    applications?: { apcid: string }[];
    status?: "open" | "close";
    date?: any;
    flag?: string;
}

export interface MessageBuble {
    id: string;
    date: any;
    file: any | null;
    typeFile: string | null;
    message: string;
    senderUid: string;
    statusFile: 'uploading' | 'uploaded' | 'failed' | 'none';
    nameFile: string;
}

export interface ChatDoc extends Pick<IDs, 'anyid'> {
    participants: string[];
    anytitle: string;
    last_update: any;
}

export interface ChatInfo extends Pick<IDs, 'uid' | 'cid' | 'anyid'> {
    id?: string;
    anytitle: string;
    type_work?: "service" | "poster";
    last_chat?: any;
    last_message?: string;
    type?: string;
};

export interface TaskProgress extends Pick<IDs, 'mid'> {
    progress: number;
    error: null | any;
    task: UploadTask;
}

export default {};
