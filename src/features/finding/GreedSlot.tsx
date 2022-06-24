import { Row, Space } from "antd";
import GreedSlider from "./GreedSlider";

const GreedSlot = () => {
    return <Space direction="vertical" style={{ width: "80%" }}>
        <Row justify="center">
            <p>Жадность поиска</p>
        </Row>
        <GreedSlider />
    </Space>
}

export default GreedSlot;