import React from "react";
import Lottie from "react-lottie";

import JsonAnnounceAnim from "assets/animation/announce.json";
import { Button } from "antd";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: JsonAnnounceAnim,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

type Props = {
    prevStep: () => void;
    onPublish: () => void;
};

function AnnounceService({ prevStep, onPublish }: Props) {
    return (
        <div className="w-full flex flex-col items-center">
            <Lottie isClickToPauseDisabled options={defaultOptions} height={200} width={200} />
            <h1 className="text-2xl font-semibold capitalize m-0">youre almost there!</h1>
            <p className="text-gray-400 m-0">Lets publish your service and get you ready to start selling.</p>
            <Button onClick={onPublish} type="primary" className="mt-10">
                Publish
            </Button>
            <div className="w-full flex items-center justify-between mt-5">
                <Button htmlType="submit" type="primary" className="BUTTON-PRIMARY" onClick={prevStep}>
                    prev
                </Button>
            </div>
        </div>
    );
}

export default AnnounceService;
