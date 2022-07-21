import { useAppDispatch, useAppSelector } from "../../app/hooks";
import SliderSmoothAfterChange from "../../common/SliderSmoothAfterChange";
import { greedChanged, selectGreed } from "./findingSlice";

const GreedSlider = () => {
    const sliderShift = useAppSelector(selectGreed);
    const dispatch = useAppDispatch();

    const onSlide = (value: number) => {
        dispatch(greedChanged(value));
    }

    return <SliderSmoothAfterChange min={0} max={1} step={0.01} value={sliderShift} onAfterChange={onSlide} />
}

export default GreedSlider;