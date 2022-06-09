import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { mapCreatorInfos } from "../../common/consts";
import ObjectSelect, { Selectable } from "../../common/ObjectSelect";
import { greedChanged, mapCreatorChanged } from "./findingSlice";
import PathfinderInfo from "./PathfinderInfo";
import SearchButton from "./SearchButton";
import ToolSelect from "./ToolSelect";
import { Col, Row, Slider, Space } from 'antd';
import styled from "styled-components";
import RefreshButton from "./RefreshButton";

const AppName = styled.h1`
    font-size: 36px;
    font-family: sans-serif;
`

const OptionsPanel = () => {
    const dispatch = useAppDispatch();
    const sliderShift = useAppSelector(state => state.greed);
    const mapCreator = useAppSelector(state => state.mapCreator);
    const mapCreatorInfo = mapCreatorInfos.find((info) => info.value === mapCreator) as Selectable; // not cool needs to be changed

    const onMapCreatorSelect = (mapCreatorInfo: Selectable) => {
        dispatch(mapCreatorChanged(mapCreatorInfo.value))
    }

    const onSlide = (value: number) => {
        dispatch(greedChanged(value));
    }

    return <Row justify="center" align="middle">
        <Col span={16} style={{ justifyContent: 'center' }}>
            <Space direction="vertical" size={50}>
                <Row justify="center">
                    <AppName>How's it going</AppName>
                </Row>
                <Row justify="center">
                    <Col span={18}>
                        <ObjectSelect objects={mapCreatorInfos} onSelect={onMapCreatorSelect} value={mapCreatorInfo} />
                    </Col>
                    <Col span={4}>
                        <RefreshButton/>
                    </Col>
                </Row>
                <Row justify="center">
                    <Space direction="vertical" style={{ width: "80%" }}>
                        <p>Жадность поиска</p>
                        <Slider min={0} max={1} step={0.01} value={sliderShift} onChange={onSlide} />
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