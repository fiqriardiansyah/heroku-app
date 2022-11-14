import Layout from "components/common/layout";
import React, { Children, useState } from "react";
import { Card } from "antd";
import { FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CHAT_PATH } from "utils/routes";

type Props = {
    children: string;
    Wrapper?: any;
    src?: string | undefined;
};

function TextOfDetailServiceOwner(props: any) {
    const { children, Wrapper = "div" } = props;
    return <Wrapper style={{ whiteSpace: "pre-line" }}>{children}</Wrapper>;
}

function DetailServiceOwnerLeft() {
    const cumaButton = ["App", "development", "Firebase", "Kotlin", "API Rest"];
    // const testImage = [];

    return (
        <Card className="flex-3">
            <div className="flex flex-col gap-4">
                <h1>I can make you a beatifull vector photo of you</h1>
                <TextOfDetailServiceOwner key={cumaButton}>
                    {`Call Text Service Text
                    
                    test aja
                    test aja
                    test aja
                    test aja
                    test aja
                    `}
                </TextOfDetailServiceOwner>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex-row gap-2">
                        <h3>Category</h3>
                        {cumaButton.map((categoryItem) => (
                            <button type="button" className="gap-2 p-2 rounded-lg bg-secondary text-base border-0">
                                {categoryItem}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 flex-row gap-2">
                        <h3>Tags</h3>
                        {cumaButton.map((TagsItem) => (
                            <button type="button" className="gap-2 p-2 rounded-lg bg-tertiary text-base border-0">
                                {TagsItem}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex-row gap-2">
                    <h3>Gallery</h3>
                    {/* {[testImage, cumaButton].map((GalleryItem, altImage) => ( */}
                    <img
                        src="https://images.all-free-download.com/images/graphiclarge/abstract_background_311486.jpg"
                        alt="{altImage}"
                        className="gap-2 w-32 h-32 rounded-lg border-0"
                    />
                    {/* ))} */}
                </div>
            </div>
        </Card>
    );
}
function DetailServiceOwnerRight() {
    return (
        <Card className="flex-1">
            <div className="flex flex-col items-center justify-center">
                <h1>Rp. 3000</h1>
                <div className="mt-4 flex flex-row gap-2">
                    <button type="button" className="px-2 py-0.5 rounded-lg bg-primary text-base border-0">
                        Order
                    </button>
                    <Link to={CHAT_PATH}>
                        <button type="button" className="flex items-center justify-center rounded-full w-10 h-10 bg-primary text-base border-0">
                            <FaPaperPlane />
                        </button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}

function DetailServiceOwner() {
    return (
        <Layout>
            <br />
            <div className="flex flex-col md:flex-row gap-4">
                <DetailServiceOwnerLeft />
                <DetailServiceOwnerRight />
            </div>
        </Layout>
    );
}

export default DetailServiceOwner;
