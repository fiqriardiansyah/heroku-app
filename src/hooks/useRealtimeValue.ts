import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type FetcherParamType<T> = {
    setLoading: Dispatch<SetStateAction<boolean>>;
    setData: Dispatch<SetStateAction<T | null>>;
};

const useRealtimeValue = <T>(fetcher: ({ setLoading, setData }: FetcherParamType<T>) => void, dependency: any = null) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {
        setLoading(true);
        fetcher({ setData, setLoading });
    }, [dependency]);

    return { data, loading };
};

export default useRealtimeValue;
