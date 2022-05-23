import { Row } from "antd";
import { useAppSelector } from "../../app/hooks";

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

const PathfinderInfo = () => {
    const greed = useAppSelector(state => state.greed);

    return <Row align="middle" style={{ minHeight: '127px', maxWidth: 350, padding: 20, backgroundColor: '#FFFDEA' }}>
        <p style={{ margin: 0 }}>
            Алгоритм похож на <strong>{getSimilarName(greed)}</strong> и <strong>{isShortest(greed) || 'не'} гарантирует</strong> найти кратчайший путь
        </p>
    </Row>
}

export default PathfinderInfo;