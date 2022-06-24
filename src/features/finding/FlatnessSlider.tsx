import { Slider } from "antd"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { flatnessChanged } from "./findingSlice";

const FlatnessSlider = () => {
    const sliderShift = useAppSelector(state => state.flatness);
    const dispatch = useAppDispatch();

    const onSlide = (value: number) => {
        dispatch(flatnessChanged(value));
    }

    return <Slider min={0} max={1} step={0.01} value={sliderShift} onChange={onSlide} />
}

export default FlatnessSlider;