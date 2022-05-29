import { Button } from "antd";
import { CSSProperties } from "react";
import { useAppDispatch } from "../../app/hooks"
import { searchStarted } from "./findingSlice";


const styles: CSSProperties = {
    width: '90%',
    height: 63,
}

const SearchButton = () => {
    const dispatch = useAppDispatch();

    const onClick = () => {
        dispatch(searchStarted());
    }

    return <Button size="large" shape="round" style={styles} onClick={onClick}>
        Найти путь
    </Button>
}

export default SearchButton