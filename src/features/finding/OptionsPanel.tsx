import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { mapCreators } from "../../common/consts";
import { createMap } from "../../common/map";
import ObjectSelect from "../../common/ObjectSelect";
import { createSize } from "../../common/size";
import { greedChanged, mapChanged } from "./findingSlice";
import PathfinderInfo from "./PathfinderInfo";
import SearchButton from "./SearchButton";
import ToolSelect from "./ToolSelect";
import { Col, InputNumber, Row, Slider, Space } from 'antd';

const OptionsPanel = () => {
    const dispatch = useAppDispatch();
    const height = useAppSelector(state => state.map.length);
    const width = useAppSelector(state => state.map[0].length);
    const sliderShift = useAppSelector(state => state.greed);

    const onMapCreatorSelect = (mapCreator: any) => {
        dispatch(mapChanged(createMap(mapCreator, createSize(height, width))));
    }

    const onSlide = (value: number) => {
        dispatch(greedChanged(value));
    }

    return <Row justify="center" align="middle">
        <Col span={16} style={{ justifyContent: 'center' }}>
            <Space direction="vertical" size={50}>
                <Row justify="center">
                    <h1>How's going</h1>
                </Row>
                <Row justify="center">
                    <ObjectSelect objects={mapCreators} onSelect={onMapCreatorSelect} value={mapCreators[0]} />
                </Row>
                <Row justify="center">
                    <Space direction="vertical">
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