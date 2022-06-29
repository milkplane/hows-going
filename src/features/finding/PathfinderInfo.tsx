import { Row } from "antd";
import styled from "styled-components";
import { useAppSelector } from "../../app/hooks";
import { selectGreed } from "./findingSlice";

const isShortest = (greed: number) => {
    return greed <= 0.5;
}

const getSimilarName = (greed: number) => {
    if (greed > 0.5) {
        return 'жадный первый лучший';
    } else if (greed > 0.4) {
        return 'A*';
    } else {
        return 'алгоритм дейкстры';
    }
}

const InfoContainer = styled(Row)`
    min-height: 127px;
    max-width: 350px;
    padding: 20px;
    background-color: #FFFDEA;
`

const PathfinderInfo = () => {
    const greed = useAppSelector(selectGreed);

    return <InfoContainer align="middle">
        <p style={{ margin: 0 }}>
            Алгоритм похож на <strong>{getSimilarName(greed)}</strong> и <strong>{isShortest(greed) || 'не'} гарантирует</strong> найти кратчайший путь
        </p>
    </InfoContainer>
}

export default PathfinderInfo;