import { areEqualCoords, Coords, stringifyCoords } from "../coords";
import { isInMap, MapData } from "../map";
import { areEqualTree, createTree, expandTree, getPathToRoot, Tree } from "../tree";
import matrixFinder from "./findingFeatures/matrixFinder";
import prioritized from "./findingFeatures/prioritized";

export type HeuristicFunction = (current: Coords, end: Coords) => number;

export type WeightGetter = (map: MapData, coords: Coords) => number;

export type SearchConfigurator = (getHeuristic: HeuristicFunction, getWeight: WeightGetter) => Pathfinder;

export type CanBePassed = (map: MapData, coords: Coords) => boolean;

export type Pathfinder = (map: MapData, start: Coords, end: Coords, canExpandTo: CanBePassed) => SearchResult;

export type SearchResult = [
    checked: Coords[],
    path: Coords[]
]

type MappedCoords = {
    [key: string]: number;
}

const getPathfinder: SearchConfigurator = (getHeuristic: HeuristicFunction, getWeight: WeightGetter) => {
    const { markAsTaken, isAlreadyTaken } = matrixFinder();
    const { addToQueue, isInQueue, isQueueEmpty,
        extractHighestPriority, updatePriority } = prioritized<Tree>(areEqualTree);
    return function (map: MapData, start: Coords, end: Coords, canBePassed: CanBePassed): SearchResult {
        const checked: Coords[] = [];
        let path: Coords[] = [];
        const canExpandTo = (coords: Coords) => isInMap(coords, map) &&
            !isAlreadyTaken(coords) &&
            canBePassed(map, coords);
        const pathLengths: MappedCoords = {};
        const root = createTree(start);
        pathLengths[stringifyCoords(root.coords)] = 0;
        addToQueue(root, 0);

        while (!isQueueEmpty()) {
            const current = extractHighestPriority();

            if (areEqualCoords(current.coords, end)) {
                checked.push(current.coords);
                path = Array.from(getPathToRoot(current));
                return [
                    checked,
                    path,
                ];
            }

            markAsTaken(current.coords);

            for (let descendant of expandTree(current, 1, canExpandTo).descendants) {
                const pathLength = pathLengths[stringifyCoords(current.coords)] + getWeight(map, descendant.coords);

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

            checked.push(current.coords);
        }

        return [
            checked,
            path
        ];
    }
}

export default getPathfinder;