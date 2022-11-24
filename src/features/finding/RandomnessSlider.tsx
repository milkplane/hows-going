import { useAppDispatch, useAppSelector } from "../../app/hooks";
import SliderSmoothAfterChange from "../../common/SliderSmoothAfterChange";
import { randomnessChanged, selectRandomness } from "./findingSlice";

const RandomnessSlider = () => {
    const sliderShift = useAppSelector(selectRandomness);
    const dispatch = useAppDispatch();

    const onSlide = (value: number) => {
        dispatch(randomnessChanged(value));
    }

    return <SliderSmoothAfterChange min={0} max={1} step={0.01} value={sliderShift} onAfterChange={onSlide} />
}

export default RandomnessSlider;