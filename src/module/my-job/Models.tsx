export interface JobsData {
    id: string;
    uid?: string;
    title: string;
    type_of_job: "task" | "hiring";
    company?: string;
    price?: string | number;
    date: any;
    description?: string;
    status: "ongoing" | "inbid" | "finish";
    owner?: string;
    current?: number;
}
