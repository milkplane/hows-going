import { Space } from "antd";
import GreedSlider from "./GreedSlider";

const GreedSlot = () => {
    return <Space direction="vertical" style={{ width: "80%" }}>
        <p>Жадность поиска</p>
        <GreedSlider />
    </Space>
}

export default GreedSlot;