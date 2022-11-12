import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

type Props = {
    suffixCount: number;
    children: string;
    className?: string;
};

function EllipsisMiddle({ suffixCount, children, className }: Props) {
    const start = children.slice(0, children.length - suffixCount).trim();
    const suffix = children.slice(-suffixCount).trim();
    return (
        <Text className={`max-w-full ${className}`} ellipsis={{ suffix }}>
            {start}
        </Text>
    );
}

export default EllipsisMiddle;
