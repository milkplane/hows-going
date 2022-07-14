import { Slider } from "antd"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { flatnessChanged, selectFlatness } from "./findingSlice";

const FlatnessSlider = () => {
    const sliderShift = useAppSelector(selectFlatness);
    const dispatch = useAppDispatch();

    const onSlide = (value: number) => {
        dispatch(flatnessChanged(value));
    }


    return <Slider min={0} max={1} step={0.01} value={sliderShift} onAfterChange={onSlide} />
}

export default FlatnessSlider;