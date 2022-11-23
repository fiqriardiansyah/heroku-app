import React from "react";

function HistoryCard() {
    return (
        <div className="w-full flex justify-between mb-3 text-start">
            <div className="">
                <p className="capitalize m-0">Convert pdf to html/css</p>
                <span className="capitalize text-gray-400 text-xs mt-1">12 oct 2022</span>
            </div>
            <p className="text-green-400 font-medium text-lg">Rp.200.000</p>
        </div>
    );
}

export default HistoryCard;
