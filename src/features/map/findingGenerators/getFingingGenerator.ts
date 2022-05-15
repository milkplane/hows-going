import { areEqualCoords, Coords, stringifyCoords } from "../../../common/coords";
import { isInMap, MapData } from "../../../common/map";
import { areEqualTree, createTree, expandTree, getPathToRoot, Tree } from "../../../common/tree";
import matrixFinder from "./findingFeatures/matrixFinder";
import prioritized from "./findingFeatures/prioritized";

type HeuristicFunction = (current: Coords, end: Coords) => number;

type WeightGetter = (coords: Coords) => number;

type MappedCoords = {
    [key: string]: number;
}

export const ignoredHeuristic: HeuristicFunction = () => 0;
export const ignoredWeight: WeightGetter = () => 0;
export const manhattanDistance: HeuristicFunction = (current: Coords, end: Coords) => {
    return Math.abs(current.i - end.i) + Math.abs(current.j - end.j);
}

const getFindingGenerator = (getHeuristic: HeuristicFunction, getWeight: WeightGetter) => {
    return function* (map: MapData, start: Coords, end: Coords) {
        const { markAsTaken, isAlreadyTaken } = matrixFinder(map);
        const { addToQueue, isInQueue, isQueueEmpty, extractHighestPriority, updatePriority } = prioritized<Tree>(areEqualTree);
        const canExpandTo = (coords: Coords) => isInMap(coords, map) && isAlreadyTaken(coords);
        const pathLengths: MappedCoords = {};

        const root = createTree(start);
        pathLengths[stringifyCoords(root.coords)] = 0;
        addToQueue(root, 0);

        while (!isQueueEmpty()) {
            const current = extractHighestPriority();

            if (areEqualCoords(current?.coords, end)) {
                yield current?.coords;
                return getPathToRoot(current);
            }

            markAsTaken(current?.coords);

            for (let descendant of expandTree(current, 1, canExpandTo).descendants) {
                const pathLength = pathLengths[stringifyCoords(current.coords)] + getWeight(descendant.coords) + 1;

                if (isInQueue(descendant) && pathLength >= pathLengths[stringifyCoords(descendant.coords)]) continue;

                pathLengths[stringifyCoords(descendant.coords)] = pathLength;
                const heuristic = getHeuristic(descendant.coords, end);
                const priority = pathLength + heuristic;

                if (isInQueue(descendant)) {
                    updatePriority(descendant, priority);
                } else {
                    addToQueue(descendant, priority);
                }
            }

            yield current.coords;
        }

        return ([] as Coords[])[Symbol.iterator]();
    }
}

export default getFindingGenerator;