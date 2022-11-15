/* eslint-disable react/no-array-index-key */
import React, { useState } from "react";
import { ServiceData } from "models";

import { Card, Input } from "antd";
import ownerService from "services/owner";
import useRealtimeValue from "hooks/useRealtimeValue";
import EmptyImage from "assets/svgs/no-service.svg";
import { useMutation, useQuery } from "react-query";
import Utils from "utils";
import { useSearchParams } from "react-router-dom";
import ServiceCard from "./service-card";

function HomeAsOwner() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("query");

    const { data, loading } = useRealtimeValue<ServiceData[]>(({ setData, setLoading }) => {
        ownerService._getAllShowServicesData((services) => {
            setLoading(false);
            setData(services);
        });
    });

    const searchMutation = useQuery(
        [query],
        async () => {
            return ownerService.ProxyRequest(async () => {
                const services = ownerService.SearchService(query || "");
                return services;
            });
        },
        {
            enabled: !!query,
        }
    );

    const onSearch = (key: string) => {
        setSearchParams({
            query: key,
        });
    };

    return (
        <div className="grid">
            <br />
            <Card title="Explore Services">
                <Input.Search
                    onSearch={onSearch}
                    placeholder="What you need today?"
                    enterButton="Search"
                    size="middle"
                    loading={searchMutation.isLoading}
                />
            </Card>
            <br />
            <Card className="CONTAINER">
                <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {(loading || searchMutation.isLoading) && [...new Array(6)].map((_, i) => <ServiceCard.Loading key={i} />)}
                    {!loading && !query && data?.map((service) => <ServiceCard data={service} key={service.id} />)}
                    {!searchMutation.isLoading && query && searchMutation.data?.map((service) => <ServiceCard data={service} key={service.id} />)}
                </div>
                {(!data || data.length === 0 || searchMutation.data?.length === 0) && (
                    <div className="w-full flex items-center justify-center flex-col">
                        <img src={EmptyImage} alt="" />
                    </div>
                )}
            </Card>
        </div>
    );
}

export default HomeAsOwner;
