import { Col, Row } from "antd"
import SeedChanger from "./SeedChanger";

const SeedSlot = () => {
    return <Row>
        <Col>
            <Row justify="center">
                <p>Зерно карты</p>
            </Row>
            <Row justify="center">
                <SeedChanger />
            </Row>
        </Col>
    </Row>
}

export default SeedSlot;