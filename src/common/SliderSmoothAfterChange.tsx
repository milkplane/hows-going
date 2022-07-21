import { SliderSingleProps } from "antd/lib/slider"
import { Slider } from "antd";
import { useEffect, useState } from "react";

type SliderSmoothAfterChangeProps = SliderSingleProps;

const SliderSmoothAfterChange = (props: SliderSmoothAfterChangeProps) => {
    const [value, setValue] = useState<number | undefined>(0);

    useEffect(() => {
        setValue(props.value)
    }, [props.value]);

    const onChange = (value: number) => {
        setValue(value);
    }

    const onAfterChange = (value: number) => {
        if (!props.onAfterChange) return;

        props.onAfterChange(value);
    }

    return (
        <Slider {...props} value={value} onChange={onChange} onAfterChange={onAfterChange}/>
    )
}

export default SliderSmoothAfterChange
