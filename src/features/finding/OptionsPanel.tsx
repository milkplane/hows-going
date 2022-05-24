import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { mapCreatorInfos } from "../../common/consts";
import { createMap } from "../../common/map";
import ObjectSelect, { Selectable } from "../../common/ObjectSelect";
import { createSize } from "../../common/size";
import { greedChanged, mapChanged } from "./findingSlice";
import PathfinderInfo from "./PathfinderInfo";
import SearchButton from "./SearchButton";
import ToolSelect from "./ToolSelect";
import { Button, Col, Row, Slider, Space } from 'antd';
import { useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useCallback } from "react";

const OptionsPanel = () => {
    const dispatch = useAppDispatch();
    const height = useAppSelector(state => state.map.length);
    const width = useAppSelector(state => state.map[0].length);
    const sliderShift = useAppSelector(state => state.greed);
    const [mapCreatorInfo, setMapCreatorInfo] = useState(mapCreatorInfos[0]);

    const onRefresh = useCallback(() => {
        dispatch(mapChanged(createMap(mapCreatorInfo.value, createSize(height, width))));
    }, [mapCreatorInfo.value, height, width])

    useEffect(() => {
        onRefresh();
    }, [mapCreatorInfo , onRefresh]);

    const onMapCreatorSelect = (mapCreatorInfo: Selectable) => {
        setMapCreatorInfo(mapCreatorInfo);
        dispatch(mapChanged(createMap(mapCreatorInfo.value, createSize(height, width))));
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
                    <ObjectSelect objects={mapCreatorInfos} onSelect={onMapCreatorSelect} value={mapCreatorInfo} />
                    <Button onClick={onRefresh}>
                        <ReloadOutlined style={{ fontSize: '16px', color: '#383838' }} />
                    </Button>
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