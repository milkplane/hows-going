import { CellType, getCellType, getRoughness } from "../cell";
import { areEqualCoords, Coords, stringifyCoords } from "../coords";
import { getCell, isInMap, MapData } from "../map";
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

export const manhattanDistance: HeuristicFunction = (current: Coords, end: Coords) => {
    return Math.abs(current.i - end.i) + Math.abs(current.j - end.j);
}

export const aquaphobicWeight: WeightGetter = (map: MapData, coords: Coords) => {
    return Math.pow(getRoughness(getCell(map, coords), 3), 5);
}

const shiftedHeuristicGetter = (getHeuristic: HeuristicFunction, shift: number): HeuristicFunction => {
    return (current: Coords, end: Coords) => getHeuristic(current, end) * shift;
}

const shiftedWeightGetter = (getWeight: WeightGetter, shift: number): WeightGetter => {
    return (map: MapData, coords: Coords) => getWeight(map, coords) * shift;
}

export const shiftedApproximationFunctions = (getHeuristic: HeuristicFunction, getWeight: WeightGetter, shift: number): [HeuristicFunction, WeightGetter] => {
    return [
        shiftedHeuristicGetter(getHeuristic, shift),
        shiftedWeightGetter(getWeight, 1 - shift), //range of greed [0, 1]
    ]
}

export const fobbidenTypeToFind = (fobiddenType: CellType): CanBePassed => {
    return (map: MapData, coords: Coords) => {
        const type = getCellType(getCell(map, coords));

        return type !== fobiddenType;
    }
}


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