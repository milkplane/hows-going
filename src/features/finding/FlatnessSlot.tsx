import { Row, Space } from "antd";
import FlatnessSlider from "./FlatnessSlider";

const FlatnessSlot = () => {
    return <Space direction="vertical" style={{ width: "80%" }}>
        <Row justify="center">
            <p>Плоскость карты</p>
        </Row>
        <FlatnessSlider />
    </Space>
}

export default FlatnessSlot;