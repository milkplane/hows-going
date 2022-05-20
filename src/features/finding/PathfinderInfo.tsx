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

    return <div>
        <p>Алгоритм похож на {getSimilarName(greed)} и {isShortest(greed) || 'не'} гарантирует найти кратчайший путь</p>
    </div>
}

export default PathfinderInfo;