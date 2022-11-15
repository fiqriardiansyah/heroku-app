import Layout from "components/common/layout";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import authService from "services/auth";
import heroService from "services/hero";
import ownerService from "services/owner";

function DetailServiceHero() {
    const { id } = useParams();
    const user = authService.CurrentUser();

    return <Layout>detail service {id}</Layout>;
}

export default DetailServiceHero;
