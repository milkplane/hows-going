import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { mapCreatorInfos } from "../../common/consts";
import ObjectSelect, { Selectable } from "../../common/ObjectSelect";
import { mapCreatorChanged } from "./findingSlice";

const MapCreatorSelect = () => {
    const dispatch = useAppDispatch();
    const mapCreator = useAppSelector(state => state.mapCreator);
    const mapCreatorInfo = mapCreatorInfos.find((info) => info.value === mapCreator) as Selectable; // not cool needs to be changed

    const onMapCreatorSelect = (mapCreatorInfo: Selectable) => {
        dispatch(mapCreatorChanged(mapCreatorInfo.value))
    }

    return <ObjectSelect objects={mapCreatorInfos} onSelect={onMapCreatorSelect} value={mapCreatorInfo} />;
}

export default MapCreatorSelect;