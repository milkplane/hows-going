import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { CellType } from "../../common/cell";
import { toolsInfo } from "../../common/consts";
import { Coords, createCoords, stringifyCoords } from "../../common/coords";
import { Tool } from "../../common/createTool";
import { createAppliedToolMap, MapData } from "../../common/map";
import { createSize, Size } from "../../common/size";
import getPathfinder, { aquaphobicWeight, fobbidenTypeToFind, manhattanDistance, shiftedApproximationFunctions } from "../../common/pathfinder/getPathfinder";
import configurable, { createMapConfig } from "../../common/mapCreators/configurable";
import { createSeed, Seed } from "../../common/seed";

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
const [getHeuristic, getWeight] = shiftedApproximationFunctions(manhattanDistance, aquaphobicWeight, greed);
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
        isLandscapedChanged(state, action: PayloadAction<boolean>) {
            state.isLandscaped = action.payload;
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
            [state.visited, state.path] = getPathfinder(getHeuristic, getWeight)(state.map, state.start, state.end, fobbidenTypeToFind(CellType.Bush));
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(isAnyOf(toolApplied, toolChanged, greedChanged,
            startChanged, endChanged, sizeChanged,
            isLandscapedChanged, seedChanged, flatnessChanged), (state) => {
                state.findingCoordsInfo = {};
                state.isSearhing = false;
                state.isPavingWay = false;
            })
            .addMatcher(isAnyOf(sizeChanged, isLandscapedChanged,
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
    searchStarted, flatnessChanged, isLandscapedChanged,
    sizeChanged, seedChanged } = mapSlice.actions;

export default mapSlice.reducer;