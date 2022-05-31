import { Button } from "antd";
import styled from "styled-components";
import { useAppDispatch } from "../../app/hooks"
import { searchStarted } from "./findingSlice";

const StyledButton = styled(Button)`
    width: 90%;
    height: 63px;
`

const SearchButton = () => {
    const dispatch = useAppDispatch();

    const onClick = () => {
        dispatch(searchStarted());
    }

    return <StyledButton size="large" shape="round" onClick={onClick}>
        Найти путь
    </StyledButton>
}

export default SearchButton