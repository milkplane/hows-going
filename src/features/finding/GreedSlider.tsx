import { Slider } from "antd"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { greedChanged } from "./findingSlice";

const GreedSlider = () => {
    const sliderShift = useAppSelector(state => state.greed);
    const dispatch = useAppDispatch();

    const onSlide = (value: number) => {
        dispatch(greedChanged(value));
    }

    return <Slider min={0} max={1} step={0.01} value={sliderShift} onChange={onSlide} />
}

export default GreedSlider;