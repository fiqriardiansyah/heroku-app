/* eslint-disable eqeqeq */
import { Button, Card } from "antd";
import Layout from "components/common/layout";
import { Poster } from "models";
import BidModal from "module/detail-job/BidModal";
import { BidType } from "module/detail-job/models";
import BiddingDetail from "module/detail-job/BiddingDetail";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContractDetail from "module/detail-job/ContractDetail";

// Mock poster
const fetchedJob: Poster[] = [
    {
        title: "Rip some code from a website html/css",
        date: "12 Oct 2022",
        type_of_job: "task",
        price: "200.000",
        id: "1",
        description:
            "I have a Landing Page designed ready to be developed. I can provide all the required assets in the required format. I need someone to build it on React. It has a form attached to it, for now the form doesn't need to be functional just a place holder would be fine.",
        category: "Front-end Development",
        skills: ["ReactJs", "CSS", "HTML", "JavaScript", "TypeScript"],
        is_fixed_price: false,
        bids: [
            {
                accept: false,
                date: "12 Desember 2020",
                description: `Hi Lucinta Luna,
                My name is Fiqri ardiansyah, I have 3 year experience of react development. I have read your requirement and I think I suitable for your need because I have work with many similar project like this before.
                I hope we can talk in the future`,
                price: (200000).ToIndCurrency("Rp."),
                id: "userid",
                hid: "",
                pid: "",
                status: 0,
                uid: "1",
            },
            {
                accept: true,
                date: new Date(),
                description: `Hi Lucinta Luna,
                My name is Fiqri ardiansyah, I have 3 year experience of react development. I have read your requirement and I think I suitable for your need because I have work with many similar project like this before.
                I hope we can talk in the future`,
                hid: "",
                pid: "",
                price: (200000.0).ToIndCurrency("Rp."),
                status: 1,
                uid: "2",
            },
        ],
        status: "open",
        number_of_hero: 5,
    },
    {
        title: "Rip some code from a website html/css",
        date: "12 Oct 2022",
        type_of_job: "hiring",
        company: "PT. Presentologics Indonesia",
        price: "200.000",
        id: "2",
        description: `Hello everyone,
        Ordent is looking for a Front-End Developer!
        
        Ordent is a team with focus on web technologies. For more than 5 years, Ordent has helped more than 45 clients from different industries, such as Government, Non-Governmental Organization, Private Sectors, and many more.
        
        What you will be doing:
        - Participate in the entire product lifecycle, focusing on coding and debugging;
        - Write clean code to develop functional web applications using micro services;
        
        - Troubleshoot and debug product;
        
        You may be fit to this role if you:
        - Have advanced ability of HTML, CSS, React/Next, Typescript, RESTful Services and APIs, CSS Preprocessors, Cross-Browser Development, and Responsive Design;
        - Have been working as Front-End Developer for at least 2 years;
        - Comfort with using distributed version control (git), semantic versioning, and change management procedures such as Github flow;
        - Willing to be located in Jakarta
        
        You can apply by sending a CV with your portfolio here. If you have any questions, please do not hesitate to email us (booky@ordent.co)!`,
        category: "Front-end Development",
        skills: ["ReactJs", "CSS", "HTML", "JavaScript", "TypeScript"],
        is_fixed_price: false,
        bids: [
            {
                accept: false,
                date: "12 Desember 2020",
                description: `Hi Lucinta Luna,
                My name is Fiqri ardiansyah, I have 3 year experience of react development. I have read your requirement and I think I suitable for your need because I have work with many similar project like this before.
                I hope we can talk in the future`,
                price: (200000).ToIndCurrency("Rp."),
                id: "userid",
                hid: "",
                pid: "",
                status: 0,
                uid: "1",
            },
            {
                accept: true,
                date: new Date(),
                description: `Hi Lucinta Luna,
                My name is Fiqri ardiansyah, I have 3 year experience of react development. I have read your requirement and I think I suitable for your need because I have work with many similar project like this before.
                I hope we can talk in the future`,
                hid: "",
                pid: "",
                price: (200000.0).ToIndCurrency("Rp."),
                status: 1,
                uid: "2",
            },
        ],
        status: "open",
        number_of_hero: 5,
    },
];

// Mock fetch data
const getJob = (id: any) => {
    /** Mock job id, "1" for job type task, "2" for job type hiring */
    const mockId = "1";
    const fetchJob = fetchedJob.filter((job) => job.id === mockId);
    return fetchJob[0];
};

function DetailJob() {
    const { id } = useParams();
    const [job, setJob] = useState<Poster>();

    /**
     * Mock uid based on the condition
     * @type "0" - User haven't bid yet
     * @type "1" - Will display bid letter but the user not accepted yet
     * @type "2" - User already accepted
     */
    const mockUid: "0" | "1" | "2" = "0";

    /** Mock get bid from job */
    const getBid = (uid: any) => {
        const userBid = job?.bids?.filter((bid) => bid.uid === uid);
        if (userBid !== undefined && userBid.length > 0) {
            return userBid[0];
        }
        return undefined;
    };

    useEffect(() => {
        setJob(getJob(id));
    }, []);

    if (job !== undefined) {
        const userBid = getBid(mockUid);
        // If userbid accepted
        if (userBid !== undefined && userBid.accept) {
            return (
                <Layout>
                    <ContractDetail job={job} bidLetter={userBid} />
                </Layout>
            );
        }
        return (
            <Layout>
                <BiddingDetail job={job} bid={userBid} />
            </Layout>
        );
    }

    return (
        <Layout>
            <div>Not found</div>;
        </Layout>
    );
}

export default DetailJob;
