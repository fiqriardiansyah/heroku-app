import { message } from "antd";
import ReviewModal from "components/modal/review-modal";
import { ChatInfo, Review, TaskProgress } from "models";
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "react-query";
import ownerService from "services/owner";
import { CURRENT_ROLE } from "utils/constant";
import { UserContext } from "./user";

type Props = {
    children: any;
};

type StateType = {
    review: Partial<Review> | null;
    header?: React.ReactElement | null;
};

type ValueContextType = {
    state?: StateType | null;
    setState?: Dispatch<SetStateAction<StateType>>;
    serviceReview?: (data: { review: Partial<Review>; header?: React.ReactElement }) => void;
};

const ActionContext = createContext<ValueContextType>({
    state: null,
});

function ActionProvider({ children }: Props) {
    const serviceReviewRef = useRef<HTMLButtonElement | null>(null);
    const [state, setState] = useState<StateType>({
        review: null,
    });

    const serviceReview = ({ review, header }: { review: Partial<Review>; header?: React.ReactElement }) => {
        setState((prev) => ({
            ...prev,
            review,
            header,
        }));
        if (serviceReviewRef.current) {
            serviceReviewRef.current.click();
        }
    };

    const onCancel = () => {
        setState({ review: null });
    };

    const reviewMutation = useMutation(
        async (review: Partial<Review>) => {
            if (!state.review) return;
            const rv: Partial<Review> = {
                ...review,
                ...state.review,
            };
            await ownerService.ServiceReview({ sid: state.review?.anyid as any, review: rv });
        },
        {
            onSuccess: () => {
                onCancel();
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const value = useMemo(
        () => ({
            state,
            setState,
            serviceReview,
        }),
        [state]
    );

    return (
        <ActionContext.Provider value={value as any}>
            {children}
            <ReviewModal onCancel={onCancel} header={state?.header} onOk={(rw) => reviewMutation.mutate(rw)}>
                {(dt) => (
                    <button className="hidden" ref={serviceReviewRef} type="button" onClick={dt.showModal}>
                        review
                    </button>
                )}
            </ReviewModal>
        </ActionContext.Provider>
    );
}

export { ActionContext, ActionProvider };
