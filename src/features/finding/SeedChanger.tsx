import { Input, Row, Space } from "antd";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { seedChanged, selectSeed } from "./findingSlice";
import SeedRefresher from "./SeedRefresher";

const SeedChanger = () => {
    const seed = useAppSelector(selectSeed);
    const dispatch = useAppDispatch();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(seedChanged(e.target.value));
    }

    return <Space size={0}>
        <Input value={seed} onChange={onChange}/>
        <SeedRefresher/>
    </Space>
}

export default SeedChanger;