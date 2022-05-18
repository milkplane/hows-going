import { createSlice, current, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { CellType, getRoughness } from "../../common/cell";
import { Coords, createCoords } from "../../common/coords";
import createTool, { Tool } from "../../common/createTool";
import { createAppliedToolMap, createMap, getCell, MapData } from "../../common/map";
import { createSize, Size } from "../../common/size";
import { searchStarted } from "../findingFlow/findingFlowSlice";
import flat from "./creators/flat";
import getSeeker from "./finding/getSeeker";

// Cant be split into findingSlice and mapSlice
// finding generator or a function of the form (map, start, end) => [ checkedCoords: Coords[], path: Coords[] ]
// needs to know the map (after creating map, tool applying, size changing, basically every available action)
// but slice only have access to the section of state that they own
// not using combine reducers makes code cumbersome

export type HeuristicFunction = (current: Coords, end: Coords) => number;

export type WeightGetter = (map: MapData, coords: Coords) => number;

export type SearchConfigurator = (getHeuristic: HeuristicFunction, getWeight: WeightGetter) => Seeker;

export type Seeker = (map: MapData, start: Coords, end: Coords) => SearchResult;

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

type MapState = {
    map: MapData;
    size: Size;
    tool: Tool;
    start: Coords;
    end: Coords;
    visited: Coords[];
    path: Coords[];
    findingCoordsInfo: SearchInfoTable;
    greed: number;
}

export const manhattanDistance: HeuristicFunction = (current: Coords, end: Coords) => {
    return Math.abs(current.i - end.i) + Math.abs(current.j - end.j);
}

export const aquaphobicWeight: WeightGetter = (map: MapData, coords: Coords) => {
    return getRoughness(getCell(map, coords), 50);
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


const initialSize = createSize(10, 10);
const initialMap = createMap(flat, initialSize);
const initialStart = createCoords(0, 0);
const initialEnd = createCoords(0, 2);
const initialGreed = 0.5; // 0 = Dijkstra's; 0.5 = A*; 1 = GBFS
const [initialGetHeuristic, initialGetWeight] = shiftedApproximationFunctions(manhattanDistance, aquaphobicWeight, 0.5);
const inititalSeeker = getSeeker(initialGetHeuristic, initialGetWeight);
const [initialVisited, InitialPath] = inititalSeeker(initialMap, initialStart, initialEnd);

const initialState: MapState = {
    size: initialSize,
    map: initialMap,
    tool: createTool(3, 0.2, 0.01, CellType.Ground),
    start: initialStart,
    end: initialEnd,
    visited: initialVisited,
    path: InitialPath,
    findingCoordsInfo: {},
    greed: initialGreed,
};

const mapSlice = createSlice({
    initialState,
    name: 'map',
    reducers: {
        toolApplied(state, action: PayloadAction<Coords>) {
            state.map = createAppliedToolMap(state.map, state.tool, action.payload);
        },
        mapChanged(state, action: PayloadAction<MapData>) {
            state.map = action.payload;
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
    },
    extraReducers: (builder) => {
        builder.addCase(searchStarted, (state, action) => {
            const [getHeuristic, getWeight] = shiftedApproximationFunctions(manhattanDistance, aquaphobicWeight, state.greed);
            [state.visited, state.path] = getSeeker(getHeuristic, getWeight)(state.map, state.start, state.end);
        })
        builder.addMatcher(isAnyOf(toolApplied, toolChanged, greedChanged,
            startChanged, endChanged), (state) => {
                state.findingCoordsInfo = {};
            })
    }
})

export const { toolApplied, toolChanged, greedChanged,
    startChanged, endChanged } = mapSlice.actions;

export default mapSlice.reducer;