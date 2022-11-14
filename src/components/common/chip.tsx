import React from "react";

type Props = {
    text: string | any;
};

function Chip({ text }: Props) {
    return <p className="px-6 py-1 text-gray-500 m-0 rounded-full w-fit bg-gray-200 font-semibold capitalize">{text}</p>;
}

export default Chip;
