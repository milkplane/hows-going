import { createSlice, current, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { CellType, getRoughness } from "../../common/cell";
import { Coords, createCoords } from "../../common/coords";
import createTool, { Tool } from "../../common/createTool";
import { createAppliedToolMap, createMap, getCell, MapCreator, MapData } from "../../common/map";
import { createSize, Size } from "../../common/size";
import flat from "./creators/flat";
import getFindingGenerator from "./findingGenerators/getFingingGenerator";

// Cant be split into findingSlice and mapSlice
// finding generator or a function of the form (map, start, end) => [ checkedCoords: Coords[], path: Coords[] ]
// needs to know the map (after creating map, tool applying, size changing, basically every available action)
// but slice only have access to the section of state that they own
// not using combine reducers makes code cumbersome

export type HeuristicFunction = (current: Coords, end: Coords) => number;

export type WeightGetter = (map: MapData, coords: Coords) => number;

export type FindingConfigurator = (getHeuristic: HeuristicFunction, getWeight: WeightGetter) => FindingGeneratorGetter;

type FindingGeneratorGetter = (map: MapData, start: Coords, end: Coords) => FindingGenerator;

type FindingGenerator = Generator<Coords, Path>

type Path = Iterator<Coords>;

type FindingInfoTable = {
    [key: string]: FindingCoordsInfo;
}

type FindingCoordsInfo = {
    isPath: boolean;
    isViewed: boolean;
}

type MapState = {
    map: MapData;
    size: Size;
    tool: Tool;
    createNewMap: MapCreator;
    start: Coords;
    end: Coords;
    findingCoordsInfo: FindingInfoTable;
    finder: FindingGenerator;
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
const inititalGetFinder = getFindingGenerator(initialGetHeuristic, initialGetWeight);

const initialState: MapState = {
    size: initialSize,
    map: initialMap,
    tool: createTool(3, 0.2, 0.01, CellType.Ground),
    createNewMap: flat,
    start: initialStart,
    end: initialEnd,
    findingCoordsInfo: {},
    finder: inititalGetFinder(initialMap, initialStart, initialEnd),
    greed: initialGreed,
};

const mapSlice = createSlice({
    initialState,
    name: 'map',
    reducers: {
        // code duplication
        // too complicated logic
        toolApplied(state, action: PayloadAction<Coords>) {
            const map = createAppliedToolMap(state.map, state.tool, action.payload);
            const [getHeuristic, getWeight] = shiftedApproximationFunctions(manhattanDistance, aquaphobicWeight, state.greed);
            state.finder = getFindingGenerator(getHeuristic, getWeight)(map, state.start, state.end);
        },
        mapCreatorChanged(state, action: PayloadAction<MapCreator>) {
            const map = action.payload(state.size);
            const [getHeuristic, getWeight] = shiftedApproximationFunctions(manhattanDistance, aquaphobicWeight, state.greed); //
            state.finder = getFindingGenerator(getHeuristic, getWeight)(map, state.start, state.end);
        },
        mapSizeChanged(state, action: PayloadAction<Size>) {
            state.size = action.payload;
            const map = state.createNewMap(action.payload);
            const [getHeuristic, getWeight] = shiftedApproximationFunctions(manhattanDistance, aquaphobicWeight, state.greed);
            state.finder = getFindingGenerator(getHeuristic, getWeight)(map, state.start, state.end);
        },
        toolChanged(state, action: PayloadAction<Tool>) {
            state.tool = action.payload;
        },
        greedChanged(state, action: PayloadAction<number>) {
            state.greed = action.payload;
            const [getHeuristic, getWeight] = shiftedApproximationFunctions(manhattanDistance, aquaphobicWeight, action.payload);
            state.finder = getFindingGenerator(getHeuristic, getWeight)(state.map, state.start, state.end);
        },
        startChanged(state, action: PayloadAction<Coords>) {
            state.start = action.payload;
            const [getHeuristic, getWeight] = shiftedApproximationFunctions(manhattanDistance, aquaphobicWeight, state.greed);
            state.finder = getFindingGenerator(getHeuristic, getWeight)(state.map, action.payload, state.end);
        },
        endChanged(state, action: PayloadAction<Coords>) {
            state.end = action.payload;
            const [getHeuristic, getWeight] = shiftedApproximationFunctions(manhattanDistance, aquaphobicWeight, state.greed);
            state.finder = getFindingGenerator(getHeuristic, getWeight)(state.map, action.payload, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(isAnyOf(toolApplied, mapCreatorChanged, mapSizeChanged,
            toolChanged, greedChanged, startChanged, endChanged), (state) => {
                state.findingCoordsInfo = {};
            })
    }
})

export const { toolApplied, mapCreatorChanged, mapSizeChanged,
    toolChanged, greedChanged, startChanged,
    endChanged } = mapSlice.actions;

export default mapSlice.reducer;