import { createSlice, current, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { CellType, getCellType, getRoughness } from "../../common/cell";
import { mapCreatorInfos, toolsInfo } from "../../common/consts";
import { Coords, createCoords, stringifyCoords } from "../../common/coords";
import { Tool } from "../../common/createTool";
import { createAppliedToolMap, createMap, getCell, MapCreator, MapData } from "../../common/map";
import { createSize, Size } from "../../common/size";
import getPathfinder from "./pathfinder/getPathfinder";

// do not split findingSlice into findingSlice/mapSlice/findingFlowSlice
// finding generator or a function of the form (map, start, end) => [ checkedCoords: Coords[], path: Coords[] ]
// needs to know the map (after creating map, tool applying, size changing, basically every available action)

export type HeuristicFunction = (current: Coords, end: Coords) => number;

export type WeightGetter = (map: MapData, coords: Coords) => number;

export type SearchConfigurator = (getHeuristic: HeuristicFunction, getWeight: WeightGetter) => Pathfinder;

export type CanBePassed = (map: MapData, coords: Coords) => boolean;

export type Pathfinder = (map: MapData, start: Coords, end: Coords, canExpandTo: CanBePassed) => SearchResult;

export type SearchResult = [
    checked: Coords[],
    path: Coords[]
]

type SearchInfoTable = {
    [key: string]: SearchCoordsInfo;
}

type SearchCoordsInfo = {
    isPath: boolean;
    isViewed: boolean;
}

type FindingState = {
    mapCreator: MapCreator;
    map: MapData;
    tool: Tool;
    start: Coords;
    end: Coords;
    visited: Coords[];
    path: Coords[];
    findingCoordsInfo: SearchInfoTable;
    greed: number;
    isSearhing: boolean;
    isPavingWay: boolean;
}

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

const shiftedApproximationFunctions = (getHeuristic: HeuristicFunction, getWeight: WeightGetter, shift: number): [HeuristicFunction, WeightGetter] => {
    return [
        shiftedHeuristicGetter(getHeuristic, shift),
        shiftedWeightGetter(getWeight, 1 - shift), //range of greed [0, 1]
    ]
}

const canBePassed = (map: MapData, coords: Coords) => {
    const type = getCellType(getCell(map, coords));

    return type !== CellType.Bush;
}

const initialMapCreator = mapCreatorInfos[0].value;
const initialTool = toolsInfo[0].tool;
const initialSize = createSize(30, 30);
const initialMap = createMap(initialMapCreator, initialSize);
const initialStart = createCoords(0, 0);
const initialEnd = createCoords(0, 2);
const initialGreed = 0.5; // 0 = Dijkstra's; 0.5 = A*; 1 = GBFS
const [initialGetHeuristic, initialGetWeight] = shiftedApproximationFunctions(manhattanDistance, aquaphobicWeight, initialGreed);
const inititalSeeker = getPathfinder(initialGetHeuristic, initialGetWeight);
const [initialVisited, InitialPath] = inititalSeeker(initialMap, initialStart, initialEnd, canBePassed);

const initialState: FindingState = {
    map: initialMap,
    mapCreator: initialMapCreator,
    tool: initialTool,
    start: initialStart,
    end: initialEnd,
    visited: initialVisited,
    path: InitialPath,
    findingCoordsInfo: {},
    greed: initialGreed,
    isSearhing: true,
    isPavingWay: false,
};

const mapSlice = createSlice({
    initialState,
    name: 'map',
    reducers: {
        toolApplied(state, action: PayloadAction<Coords>) {
            state.map = createAppliedToolMap(state.map, state.tool, action.payload);
        },
        mapCreatorChanged(state, action: PayloadAction<MapCreator>) {
            const size = createSize(
                state.map.length,
                state.map[0].length,
            )
            state.map = action.payload(size);
            state.mapCreator = action.payload;
        },
        sizeChanged(state, action: PayloadAction<Size>) {
            state.map = state.mapCreator(action.payload);
        },
        mapRefreshed(state) {
            const size = createSize(
                state.map.length,
                state.map[0].length,
            )
            state.map = state.mapCreator(size);
        },
        toolChanged(state, action: PayloadAction<Tool>) {
            state.tool = action.payload;
        },
        greedChanged(state, action: PayloadAction<number>) {
            state.greed = action.payload;
        },
        startChanged(state, action: PayloadAction<Coords>) {
            state.start = action.payload;
        },
        endChanged(state, action: PayloadAction<Coords>) {
            state.end = action.payload;
        },
        oneStepSearch(state) {
            const visitedCoords = state.visited.shift();
            if (visitedCoords) {
                state.findingCoordsInfo[stringifyCoords(visitedCoords)] = {
                    isViewed: true,
                    isPath: false,
                }
            } else {
                state.isSearhing = false;
                state.isPavingWay = true;

                const pathCoords = state.path.shift();

                if (pathCoords) {
                    state.findingCoordsInfo[stringifyCoords(pathCoords)] = {
                        isViewed: true,
                        isPath: true,
                    }
                } else {
                    state.isPavingWay = false;
                }
            }
        },
        searchStarted(state) {
            state.isSearhing = true;
            state.isPavingWay = false;
            state.findingCoordsInfo = {};
            const [getHeuristic, getWeight] = shiftedApproximationFunctions(manhattanDistance, aquaphobicWeight, state.greed);
            [state.visited, state.path] = getPathfinder(getHeuristic, getWeight)(state.map, state.start, state.end, canBePassed);
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(isAnyOf(toolApplied, toolChanged, greedChanged,
            startChanged, endChanged, mapRefreshed,
            mapCreatorChanged, sizeChanged), (state) => {
                state.findingCoordsInfo = {};
                state.isSearhing = false;
                state.isPavingWay = false;
            })
    }
})

export const { toolApplied, toolChanged, greedChanged,
    startChanged, endChanged, oneStepSearch,
    searchStarted, mapCreatorChanged,
    sizeChanged, mapRefreshed } = mapSlice.actions;

export default mapSlice.reducer;