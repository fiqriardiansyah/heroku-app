import Navigation from "components/navigation";
import React from "react";
import Footer from "./footer";

type Props = {
    children: any;
};

function Layout({ children }: Props) {
    return (
        <div className="w-full bg-base">
            <Navigation />
            <div className="CONTAINER min-h-[90vh] mb-10">{children}</div>
            <Footer />
        </div>
    );
}

export default Layout;
