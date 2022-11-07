import React from "react";

interface Prop {
    poster: import("models").Poster;
}

function PosterItem({ poster }: Prop) {
    const { title, date, type_of_job: typeOfJob, price, description, skills, company } = poster;
    const owner = "Owner";
    if (typeOfJob === "task") {
        return (
            <div style={{ borderBottom: "1px solid #7E7E7E" }} id="poster-item" className="flex flex-col justify-evenly my-3 h-68 pb-5 ">
                <h3 className="m-0">{title}</h3>
                <div>
                    <p className="m-0 text-sm">{`Owner: &ensp; ${owner}`}</p>
                    <p style={{ color: "#A7A7A7" }} className="m-0 text-10">
                        {date}
                    </p>
                </div>
                <p className="m-0 text-16">{` Fixed Price - ${price}`}</p>
                <p style={{ color: "#828282" }} className="m-0 text-16">
                    {description}
                </p>
                <div id="tag">
                    {skills.map((skill) => (
                        <button style={{ color: "#606060" }} className="px-5 py-2 rounded-2xl border-none cursor-pointer" type="button">
                            {skill}
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div style={{ borderBottom: "1px solid #7E7E7E" }} id="poster-item" className="flex flex-col justify-evenly my-3 h-68 pb-5 ">
            <div>
                <h3 className="m-0">{title}</h3>
                <p className="m-0 text-sm">{company}</p>
            </div>
            <div>
                <p className="m-0 text-sm">{`Owner: &ensp; ${owner}`}</p>
                <p style={{ color: "#A7A7A7" }} className="m-0 text-10">
                    {date}
                </p>
            </div>
            <p className="m-0 text-16">{` Fixed Price - ${price}`}</p>
            <p style={{ color: "#828282" }} className="m-0 text-16">
                {description}
            </p>
            <div id="tag">
                {skills.map((skill) => (
                    <button style={{ color: "#606060" }} className="px-5 py-2 rounded-2xl border-none cursor-pointer" type="button">
                        {skill}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PosterItem;
