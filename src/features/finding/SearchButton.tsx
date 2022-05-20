import { useAppDispatch } from "../../app/hooks"
import { searchStarted } from "./findingSlice";

const SearchButton = () => {
    const dispatch = useAppDispatch();

    const onClick = () => {
        dispatch(searchStarted());
    }

    return <button onClick={onClick}>
        найти путь
    </button>
}

export default SearchButton