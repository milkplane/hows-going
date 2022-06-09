import PathfinderInfo from "./PathfinderInfo";
import SearchButton from "./SearchButton";
import ToolSelect from "./ToolSelect";
import { Col, Row, Space } from 'antd';
import styled from "styled-components";
import GreedSlider from "./GreedSlider";
import MapChanger from "./MapChanger";

const AppName = styled.h1`
    font-size: 36px;
    font-family: sans-serif;
`

const OptionsPanel = () => {
    return <Row justify="center" align="middle">
        <Col span={16} style={{ justifyContent: 'center' }}>
            <Space direction="vertical" size={50}>
                <Row justify="center">
                    <AppName>How's it going</AppName>
                </Row>
                <Row justify="center">
                    <MapChanger/>
                </Row>
                <Row justify="center">
                    <Space direction="vertical" style={{ width: "80%" }}>
                        <p>Жадность поиска</p>
                        <GreedSlider/>
                    </Space>
                </Row>
                <Row justify="center">
                    <PathfinderInfo />
                </Row>
                <Row justify="center">
                    <ToolSelect />
                </Row>
                <Row justify="center">
                    <SearchButton />
                </Row>
            </Space>
        </Col>
    </Row>
}

export default OptionsPanel;