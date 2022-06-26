import { CellType, getCellType, getRoughness } from "../cell";
import { areEqualCoords, Coords } from "../coords";
import { getCell, isInMap, MapData } from "../map";
import { areEqualTree, createTree, expandTree, getPathToRoot, Tree } from "../tree";
import matrixFinder from "./findingFeatures/matrixFinder";
import prioritized from "./findingFeatures/prioritized";
import weighted from "./findingFeatures/weighted";

export type HeuristicFunction = (current: Coords, end: Coords) => number;
export type WeightGetter = (map: MapData, coords: Coords) => number;
export type SearchConfigurator = (getHeuristic: HeuristicFunction, getWeight: WeightGetter) => Pathfinder;
export type CanBePassed = (map: MapData, coords: Coords) => boolean;
export type Pathfinder = (map: MapData, start: Coords, end: Coords, canExpandTo: CanBePassed) => SearchResult;
export type SearchResult = [checked: Coords[], path: Coords[]];
export type UnitInterval = number;
export type ShiftedHeuristicGetter = (getHeuristic: HeuristicFunction, shift: UnitInterval) => HeuristicFunction;
export type ShiftedWeightGetter = (getWeight: WeightGetter, shift: UnitInterval) => WeightGetter;
export type AssessmentGetters = [HeuristicFunction, WeightGetter];
export type ShiftedAssessmentGetters = (getHeuristic: HeuristicFunction, getWeight: WeightGetter, shift: number) => AssessmentGetters;

export const manhattanDistance: HeuristicFunction = (current, end) => {
    return Math.abs(current.i - end.i) + Math.abs(current.j - end.j);
}

export const aquaphobicWeight: WeightGetter = (map, coords) => {
    const waterMultiplicator = 5;
    const roughness = getRoughness(getCell(map, coords), 3);
    return Math.pow(roughness, waterMultiplicator);
}

const shiftedHeuristicGetter: ShiftedHeuristicGetter = (getHeuristic, shift) => {
    return (current, end) => getHeuristic(current, end) * shift;
}

const shiftedWeightGetter: ShiftedWeightGetter = (getWeight, shift) => {
    return (map, coords) => getWeight(map, coords) * shift;
}

export const shiftedAssessmentGetters: ShiftedAssessmentGetters = (getHeuristic, getWeight, shift) => {
    return [
        shiftedHeuristicGetter(getHeuristic, shift),
        shiftedWeightGetter(getWeight, 1 - shift), // UnitInterval [0, 1]
    ]
}

export const fobbidenTypeToFind = (fobiddenType: CellType): CanBePassed => {
    return (map: MapData, coords: Coords) => {
        const type = getCellType(getCell(map, coords));

        return type !== fobiddenType;
    }
}


// still too nasty. It might be helpful to use function declaration to write the actual finding algorithm and below it its helper functions
// original function can be found at the bottom of the file
const getPathfinder: SearchConfigurator = (getHeuristic, getWeight) => {
    const { markAsTaken: markAsTakenCoords, isAlreadyTaken } = matrixFinder();
    const { addToQueue, isInQueue, isQueueEmpty,
        extractHighestPriority, updatePriority } = prioritized<Tree>(areEqualTree);
    const { setPathLength, getPathLength } = weighted();

    return (map, start, end, canBePassed) => {
        // helper functions
        const canExpandTo = (coords: Coords) => {
            return isInMap(coords, map) &&
                !isAlreadyTaken(coords) &&
                canBePassed(map, coords);
        }

        const isEnd = (node: Tree) => {
            return areEqualCoords(node.coords, end);
        }

        const getPathTo = (node: Tree) => {
            return Array.from(getPathToRoot(node));
        }

        const markAsChecked = (node: Tree) => {
            checked.push(node.coords)
        }

        const endIsFoundOn = (node: Tree) => {
            markAsChecked(node);
        }

        const IsShorterLengthTo = (node: Tree, length: number) => {
            return length < getPathLength(node.coords)
        }

        const markAsTaken = (node: Tree) => {
            markAsTakenCoords(node.coords);
        }

        const getDescendants = (node: Tree) => {
            return expandTree(node, 1, canExpandTo).descendants;
        }

        const putInQueue = (node: Tree, priority: number) => {
            if (isInQueue(node)) {
                updatePriority(node, priority);
            } else {
                addToQueue(node, priority);
            }
        }

        const shouldNotChangePathLengthTo = (node: Tree, newPathLength: number) => {
            return isInQueue(node) && !IsShorterLengthTo(node, newPathLength);
        }

        const getDescendantPathLength = (node: Tree, descendant: Tree) => {
            return getPathLength(node.coords) + getWeight(map, descendant.coords)
        }

        const checkDescendant = (node: Tree, descendant: Tree) => {
            const pathLength = getDescendantPathLength(node, descendant);

            if (shouldNotChangePathLengthTo(descendant, pathLength)) return;

            setPathLength(descendant.coords, pathLength);
            const heuristic = getHeuristic(descendant.coords, end);
            const priority = pathLength + heuristic;

            putInQueue(descendant, priority);
        }

        const expand = (node: Tree) => {
            getDescendants(node).forEach(descendant => checkDescendant(node, descendant));
        }

        // the algorithm
        const checked: Coords[] = [];
        const path: Coords[] = [];
        const root = createTree(start);
        setPathLength(root.coords, 0);
        addToQueue(root, 0);

        while (!isQueueEmpty()) {
            const node = extractHighestPriority();

            if (isEnd(node)) {
                endIsFoundOn(node);
                return [checked, getPathTo(node)];
            }

            markAsTaken(node);
            expand(node);
            markAsChecked(node);
        }

        return [checked, path];
    }
}

/*
// !!! ORIGINAL FUNCTION !!!

const getPathfinder: SearchConfigurator = (getHeuristic, getWeight) => {
    const { markAsTaken, isAlreadyTaken } = matrixFinder();
    const { addToQueue, isInQueue, isQueueEmpty,
        extractHighestPriority, updatePriority } = prioritized<Tree>(areEqualTree);
    const { setPathLength, getPathLength } = weighted();

    return (map, start, end, canBePassed) => {
        const checked: Coords[] = [];
        let path: Coords[] = [];
        const canExpandTo = (coords: Coords) => isInMap(coords, map) &&
            !isAlreadyTaken(coords) &&
            canBePassed(map, coords);

        const root = createTree(start);
        setPathLength(root.coords, 0);
        addToQueue(root, 0);

        while (!isQueueEmpty()) {
            const current = extractHighestPriority();

            if (areEqualCoords(current.coords, end)) {
                checked.push(current.coords);
                path = Array.from(getPathToRoot(current));
                return [checked, path];
            }

            markAsTaken(current.coords);

            for (let descendant of expandTree(current, 1, canExpandTo).descendants) {
                const pathLength = getPathLength(current.coords) + getWeight(map, descendant.coords);

                if (isInQueue(descendant) && pathLength >= getPathLength(descendant.coords)) continue;

                setPathLength(descendant.coords, pathLength);
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

        return [checked, path];
    }
}
*/

export default getPathfinder;