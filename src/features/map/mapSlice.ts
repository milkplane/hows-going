import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CellType } from "../../common/cell";
import { Coords, createCoords } from "../../common/coords";
import createTool, { Tool } from "../../common/createTool";
import { createAppliedToolMap, createMap, MapCreator, MapData } from "../../common/map";
import { createSize, Size } from "../../common/size";
import flat from "./creators/flat";

type MapState = {
    map: MapData;
    size: Size;
    tool: Tool;
    createNewMap: MapCreator;
}

const initialState: MapState = {
    size: createSize(10, 10),
    map: createMap(flat, createSize(10, 10)),
    tool: createTool(3, 0.2, 0.01, CellType.Ground),
    createNewMap: flat,
};

const mapSlice = createSlice({
    initialState,
    name: 'map',
    reducers: {
        toolApplied(state, action: PayloadAction<Coords>) {
            state.map = createAppliedToolMap(state.map, state.tool, action.payload);
        },
        mapCreatorChanged(state, action: PayloadAction<MapCreator>) {
            state.map = action.payload(state.size); //side effect
        },
        mapSizeChanged(state, action: PayloadAction<Size>) {
            state.size = action.payload;
            state.map = state.createNewMap(action.payload); //side effect
        },
        toolChanged(state, action: PayloadAction<Tool>) {
            state.tool = action.payload;
        }
    }
})

export const {toolApplied, mapCreatorChanged, mapSizeChanged} = mapSlice.actions;

export default mapSlice.reducer;