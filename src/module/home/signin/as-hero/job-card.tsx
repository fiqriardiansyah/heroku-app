import { Skeleton, Space } from "antd";
import Chip from "components/common/chip";
import moment from "moment";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import userService from "services/user";
import Utils from "utils";
import { DETAIL_JOB_PATH } from "utils/routes";

interface Prop {
    poster: import("models").Poster;
}

function Loading() {
    return (
        <div className="py-3">
            <Skeleton paragraph={{ rows: 4 }} />
            <div style={{ borderBottom: "1px solid #c3c3c3" }} className="w-full" />
        </div>
    );
}

function JobCard({ poster }: Prop) {
    const userQuery = useQuery(
        ["user", poster?.uid],
        async () => {
            const usr = await userService.GetUser(poster?.uid as any);
            return usr;
        },
        {
            enabled: !!poster?.uid,
        }
    );

    return (
        <Link to={`${DETAIL_JOB_PATH}/${poster.id}`}>
            <div className="w-full p-4 hover:bg-gray-50 text-gray-600" style={{ borderBottom: "1px solid #c3c3c3" }}>
                <p className="m-0 capitalize font-semibold text-lg">{poster.title}</p>
                {poster.type_of_job === "hiring" && <p className="capitalize text-sm font-medium m-0">{poster?.company}</p>}
                <p className="font-medium m-0 mt-4 capitalize">Owner: {userQuery.data?.name || ""}</p>
                <span className="text-gray-400 text-xs">Post {moment(poster.date).format("DD MMM yyyy")}</span>
                {poster.type_of_job === "task" && (
                    <p className="m-0">
                        {poster.is_fixed_price ? "Fixed" : "Bargain"} price - {parseInt(poster.price as string, 10).ToIndCurrency("Rp")}
                    </p>
                )}
                <div className="my-3">{Utils.stripHtml(poster.description).CutText(200)}</div>
                <Space className="flex flex-wrap">
                    {poster.skills?.map((skill) => (
                        <Chip text={skill} key={skill} />
                    ))}
                </Space>
            </div>
        </Link>
    );
}

JobCard.Loading = Loading;

export default JobCard;
