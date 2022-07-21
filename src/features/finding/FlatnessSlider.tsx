import { useAppDispatch, useAppSelector } from "../../app/hooks";
import SliderSmoothAfterChange from "../../common/SliderSmoothAfterChange";
import { flatnessChanged, selectFlatness } from "./findingSlice";

const FlatnessSlider = () => {
    const sliderShift = useAppSelector(selectFlatness);
    const dispatch = useAppDispatch();

    const onSlide = (value: number) => {
        dispatch(flatnessChanged(value));
    }


    return <SliderSmoothAfterChange min={0} max={1} step={0.01} value={sliderShift} onAfterChange={onSlide} />
}

export default FlatnessSlider;