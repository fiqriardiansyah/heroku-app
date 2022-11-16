import Navigation from "components/navigation";
import React from "react";
import Lottie from "react-lottie";
import JsonLoadingAnim from "assets/animation/loading-4-box.json";
import Footer from "./footer";

type Props = {
    children: any;
    useFooter?: boolean;
    loading?: boolean;
};

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: JsonLoadingAnim,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

function Layout({ children, useFooter = true, loading = false }: Props) {
    return (
        <div className="w-full bg-base">
            <Navigation />
            {loading && (
                <div className="h-[90vh] w-full flex items-center justify-center absolute top-0 left-0 z-100 flex-col">
                    <Lottie isClickToPauseDisabled options={defaultOptions} height={100} width={100} />
                    <p className="capitalize font-medium text-gray-400 text-xl">get data...</p>
                </div>
            )}
            <div className={`CONTAINER min-h-[90vh] mb-10 ${loading ? "blur-sm" : ""}`}>{children}</div>
            {useFooter && <Footer />}
        </div>
    );
}

export default Layout;
