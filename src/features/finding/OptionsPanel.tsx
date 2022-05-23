import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { mapCreators } from "../../common/consts";
import { createMap } from "../../common/map";
import ObjectSelect from "../../common/ObjectSelect";
import { createSize } from "../../common/size";
import { greedChanged, mapChanged } from "./findingSlice";
import PathfinderInfo from "./PathfinderInfo";
import SearchButton from "./SearchButton";
import ToolSelect from "./ToolSelect";
import { InputNumber, Slider } from 'antd';

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

    return <div>
        <ObjectSelect objects={mapCreators} onSelect={onMapCreatorSelect} value={mapCreators[0]} />
        <Slider min={0} max={1} step={0.01} value={sliderShift} onChange={onSlide}/>
        <PathfinderInfo />
        <ToolSelect />
        <SearchButton />
    </div>
}

export default OptionsPanel;