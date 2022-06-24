import { ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useAppDispatch } from "../../app/hooks";
import { createSeed } from "../../common/seed";
import { seedChanged } from "./findingSlice";

const SeedRefresher = () => {
    const dispatch = useAppDispatch();

    const onRefresh = () => {
        dispatch(seedChanged(createSeed()));
    }

    return <Button onClick={onRefresh}>
        <ReloadOutlined style={{ fontSize: "16px", color: "#383838" }} />
    </Button>
}

export default SeedRefresher;