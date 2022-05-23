import { Button } from "antd";
import { useAppDispatch } from "../../app/hooks"
import { searchStarted } from "./findingSlice";

const SearchButton = () => {
    const dispatch = useAppDispatch();

    const onClick = () => {
        dispatch(searchStarted());
    }

    return <Button size="large" onClick={onClick}>
        найти путь
    </Button>
}

export default SearchButton