import { Row, Space } from "antd";
import RandomnessSlider from "./RandomnessSlider";

const RandomnessSlot = () => {
    return <Space direction="vertical" style={{ width: "80%" }}>
        <Row justify="center">
            <p>Случайность поиска</p>
        </Row>
        <RandomnessSlider />
    </Space>
}

export default RandomnessSlot;