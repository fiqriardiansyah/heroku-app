import Navigation from "components/navigation";
import React from "react";
import Footer from "./footer";

type Props = {
    children: any;
    useFooter?: boolean;
};

function Layout({ children, useFooter = true }: Props) {
    return (
        <div className="w-full bg-base">
            <Navigation />
            <div className="CONTAINER min-h-[90vh] mb-10">{children}</div>
            {useFooter && <Footer />}
        </div>
    );
}

export default Layout;
