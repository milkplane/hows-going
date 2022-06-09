import { Col } from "antd";
import MapCreatorSelect from "./MapCreatorSelect";
import RefreshButton from "./RefreshButton";

const MapChanger = () => {
    return <>
        <Col span={18}>
            <MapCreatorSelect />
        </Col>
        <Col span={4}>
            <RefreshButton />
        </Col>
    </>
}

export default MapChanger;