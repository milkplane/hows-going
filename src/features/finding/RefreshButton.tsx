import { ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useAppDispatch } from "../../app/hooks";
import { mapRefreshed } from "./findingSlice";

const RefreshButton = () => {
    const dispatch = useAppDispatch();

    const onRefresh = () => {
        dispatch(mapRefreshed());
    }

    return <Button onClick={onRefresh}>
        <ReloadOutlined style={{ fontSize: "16px", color: "#383838" }} />
    </Button>
}

export default RefreshButton;