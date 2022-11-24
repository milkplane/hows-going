import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { CellType } from "../../common/cell";
import { toolsInfo } from "../../common/consts";
import { areEqualCoords, Coords, createCoords, stringifyCoords } from "../../common/coords";
import { Tool } from "../../common/createTool";
import { createAppliedToolMap, MapData } from "../../common/map";
import { createSize, Size } from "../../common/size";
import getPathfinder, { aquaphobicWeight, fobbidenTypeToFind, manhattanDistance, shiftedAssessmentGetters } from "../../common/pathfinder/getPathfinder";
import configurable, { createMapConfig } from "../../common/mapCreators/configurable";
import { createSeed, Seed } from "../../common/seed";
import { RootState } from "../../app/store";

// do not split findingSlice into findingSlice/mapSlice/findingFlowSlice
// finding generator or a function of the form (map, start, end) => [ checkedCoords: Coords[], path: Coords[] ]
// needs to know the map (after creating map, tool applying, size changing, basically every available action)

type SearchInfoTable = {
    [key: string]: SearchCoordsInfo;
}

type SearchCoordsInfo = {
    isPath: boolean;
    isViewed: boolean;
}

type FindingState = {
    flatness: number;
    size: Size;
    isLandscaped: boolean;
    seed: Seed;
    map: MapData;
    tool: Tool;
    start: Coords;
    end: Coords;
    visited: Coords[];
    path: Coords[];
    findingCoordsInfo: SearchInfoTable;
    greed: number;
    randomness: number;
    isSearhing: boolean;
    isPavingWay: boolean;
}

const tool = toolsInfo[0].tool;
const size = createSize(30, 30);
const flatness = 1;
const isLandscaped = true;
const seed = createSeed();
const map = configurable(createMapConfig(
    size,
    flatness,
    isLandscaped,
    seed,
));
const start = createCoords(0, 0);
const end = createCoords(0, 2);
const greed = 0.5; // 0 = Dijkstra's; 0.5 = A*; 1 = GBFS
const randomness = 0;
const [getHeuristic, getWeight] = shiftedAssessmentGetters(manhattanDistance, aquaphobicWeight, greed, randomness);
const seeker = getPathfinder(getHeuristic, getWeight);
const [visited, path] = seeker(map, start, end, fobbidenTypeToFind(CellType.Bush));

const initialState: FindingState = {
    map,
    flatness,
    size,
    seed,
    isLandscaped,
    tool,
    start,
    end,
    visited,
    path,
    findingCoordsInfo: {},
    greed,
    randomness,
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
        sizeChanged(state, action: PayloadAction<Size>) {
            state.size = action.payload;
        },
        seedChanged(state, action: PayloadAction<Seed>) {
            state.seed = action.payload;
        },
        landscapeToggled(state) {
            state.isLandscaped = !state.isLandscaped;
        },
        flatnessChanged(state, action: PayloadAction<number>) {
            state.flatness = action.payload;
        },
        toolChanged(state, action: PayloadAction<Tool>) {
            state.tool = action.payload;
        },
        greedChanged(state, action: PayloadAction<number>) {
            state.greed = action.payload;
        },
        randomnessChanged(state, action: PayloadAction<number>) {
            state.randomness = action.payload;
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
            const [getHeuristic, getWeight] = shiftedAssessmentGetters(manhattanDistance, aquaphobicWeight, state.greed, state.randomness);
            [state.visited, state.path] = getPathfinder(getHeuristic, getWeight)(state.map, state.start, state.end, fobbidenTypeToFind(CellType.Bush));
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(isAnyOf(toolApplied, toolChanged, greedChanged,
            startChanged, endChanged, sizeChanged,
            landscapeToggled, seedChanged, flatnessChanged), (state) => {
                state.findingCoordsInfo = {};
                state.isSearhing = false;
                state.isPavingWay = false;
            })
            .addMatcher(isAnyOf(sizeChanged, landscapeToggled,
                seedChanged, flatnessChanged), (state) => {
                    state.map = configurable(createMapConfig(
                        state.size,
                        state.flatness,
                        state.isLandscaped,
                        state.seed,
                    ))
                })

    }
})

export const { toolApplied, toolChanged, greedChanged,
    startChanged, endChanged, oneStepSearch,
    searchStarted, flatnessChanged, landscapeToggled,
    sizeChanged, seedChanged, randomnessChanged } = mapSlice.actions;

export default mapSlice.reducer;

export const selectFlatness = (state: RootState) => state.finding.flatness;
export const selectGreed = (state: RootState) => state.finding.greed;
export const selectRandomness = (state: RootState) => state.finding.randomness;
export const selectIslandScaped = (state: RootState) => state.finding.isLandscaped;
export const selectSeed = (state: RootState) => state.finding.seed;
export const selectTool = (state: RootState) => state.finding.tool;
export const selectStart = (state: RootState) => state.finding.start;
export const selectEnd = (state: RootState) => state.finding.end;
export const selectIsPath = (state: RootState) => state.finding.path;
export const selectIsVisited = (state: RootState) => state.finding.visited;
export const selectIsSearching = (state: RootState) => state.finding.isSearhing;
export const selectIsPavingWay = (state: RootState) => state.finding.isPavingWay;
export const selectMapHeight = (state: RootState) => state.finding.map.length;
export const selectIsStart = (state: RootState, coords: Coords) => areEqualCoords(state.finding.start, coords);
export const selectIsEnd = (state: RootState, coords: Coords) => areEqualCoords(state.finding.end, coords);
export const selectMapRow = (state: RootState, row: number) => state.finding.map[row];
export const selectSearchInfo = (state: RootState, coords: Coords) => {
    const stringifiedCoords = stringifyCoords(coords);
    return state.finding.findingCoordsInfo[stringifiedCoords];
};