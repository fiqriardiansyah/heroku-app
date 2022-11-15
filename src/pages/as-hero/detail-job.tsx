import Layout from "components/common/layout";
import React from "react";
import { useParams } from "react-router-dom";

function DetailJob() {
    const params = useParams();

    return <Layout>{params.id}</Layout>;
}

export default DetailJob;
