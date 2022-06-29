import { Checkbox, Row } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { landscapeToggled, selectIslandScaped } from "./findingSlice";

const LandscapeSlot = () => {
    const dispatch = useAppDispatch();
    const isLandscaped = useAppSelector(selectIslandScaped);
    
    const onChange = () => {
        dispatch(landscapeToggled())
    }

    return <Row>
        <Checkbox onChange={onChange} checked={isLandscaped}>Озеленение карты</Checkbox>
    </Row>
}

export default LandscapeSlot;