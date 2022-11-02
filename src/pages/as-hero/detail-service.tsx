import Layout from "components/common/layout";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import authService from "services/auth";
import heroService from "services/hero";
import ownerService from "services/owner";

function DetailServiceHero() {
    const { id, uid: heroUid } = useParams();
    const user = authService.CurrentUser();

    const getService = useQuery(
        ["get-service", id, heroUid],
        async () => {
            const req = await heroService.GetDetailService({
                sid: id as any,
                uid: heroUid as any,
            });
            return req;
        },
        {
            enabled: !!id && !!heroUid,
        }
    );

    const getDetailServiceFromOwner = useQuery(
        // only for owner [IMPORTANT]
        ["get-service-owner", id, heroUid],
        async () => {
            const req = await ownerService.GetDetailService({
                sid: id as any,
                hid: heroUid as any,
            });
            return req;
        }
    );

    const orderServiceMutation = useMutation(async () => {
        const req = await ownerService.OrderService({
            sid: id as any,
            uid: user?.uid as any,
            hid: heroUid as any,
        });
        return req;
    });

    const acceptServiceMutation = useMutation(async () => {
        const req = await heroService.AcceptRequestService({
            sid: id as any,
            uid: user?.uid as any,
            request: {
                id: "-NFo6sLBx7DzMYBf25BA",
                uid: "ckxpvX5PQlRICHFb7eSyDh2InIr2",
                date: 1667144718377,
            },
        });
        return req;
    });

    const declineServiceMutation = useMutation(async () => {
        const req = await heroService.DeclineRequestService({
            sid: id as any,
            uid: user?.uid as any,
            request: {
                id: "-NFo1aKDLlvUhJyQjPS9",
                uid: "ckxpvX5PQlRICHFb7eSyDh2InIr2",
                date: 1667144718377,
            },
        });
        return req;
    });

    const assignmentsQuery = useQuery([user?.uid], async () => {
        const req = await ownerService.GetAssigments({
            uid: user?.uid as any,
        });
        return req;
    });

    const setJourneyOrder = useMutation(async () => {
        const req = await heroService.SetJourneyServiceOrder({
            uid: user?.uid as any,
            sid: id as any,
            order: {
                id: "-NFo6wa3PYYL3XQ7l5Zr",
                uid: "ckxpvX5PQlRICHFb7eSyDh2InIr2",
                status: 0,
                date: 1667321809564,
            },
        });
        return "";
    });

    return (
        <Layout>
            {getService.isLoading && <p>loading..</p>}
            <h1>{getService.data?.title}</h1>
            <button type="button" onClick={() => orderServiceMutation.mutate()}>
                order
            </button>
            <button
                type="button"
                onClick={() => acceptServiceMutation.mutate()}
            >
                accept
            </button>
            <button
                type="button"
                onClick={() => declineServiceMutation.mutate()}
            >
                reject
            </button>
            <button type="button" onClick={() => setJourneyOrder.mutate()}>
                increment journey
            </button>
        </Layout>
    );
}

export default DetailServiceHero;
