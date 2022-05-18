import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { endChanged, greedChanged, startChanged, toolApplied } from "../map/mapSlice";

type FindingFlowState = {
    isSearhing: boolean;
    isDrawingPath: boolean;
}

const initialState: FindingFlowState = {
    isSearhing: false,
    isDrawingPath: false,
}

const findingFlowSlice = createSlice({
    name: 'findingFlow',
    initialState,
    reducers: {
        searchStarted(state) {
            state.isSearhing = true;
            state.isDrawingPath = false;
        },
        drawingPathStarted(state) {
            state.isDrawingPath = true;
            state.isSearhing = false;
        },
        drawingPathCompleted(state) {
            state.isDrawingPath = false;
            state.isSearhing = false;
        }
    },
    extraReducers: (builder) =>
        builder
            .addMatcher(isAnyOf(toolApplied, greedChanged, startChanged, endChanged), (state, action) => {
                    state.isSearhing = false;
                    state.isDrawingPath = true;
                })
});

export const {searchStarted, drawingPathStarted, drawingPathCompleted} = findingFlowSlice.actions;

export default findingFlowSlice.reducer;