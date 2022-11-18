export interface MyJobData {
    id: string;
    uid?: string;
    title: string;
    type_of_job: "task" | "hiring";
    company?: string;
    price?: string | number;
    date: any;
    description?: string;
    owner?: string;

    current?: number;
    status: "ongoing" | "inbid" | "finish";
}
