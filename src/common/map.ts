import { Cell, changeCellHeight, changeCellType, copyCell } from "./cell";
import { Coords } from "./coords";
import { Tool } from "./createTool";
import { arrayFromTree, createTree, expandTree } from "./tree";

export type MapData = Cell[][];

export type MapChange = {
    coords: Coords;
    newCell: Cell;
}

type Press = {
    coords: Coords;
    force: number;
}

export type MapChanges = MapChange[];

export const copyMap = (map: MapData): MapData => {
    return map.map(row => {
        return row.map(cell => copyCell(cell));
    });
}

const isRowInMap = (i: number, map: MapData): boolean => {
    return i >= 0 && i < map.length;
}

const isColumnInMap = (j: number, map: MapData): boolean => {
    return j >= 0 && j < map[0].length;
}

export const isInMap = (coords: Coords, map: MapData): boolean => {
    return isRowInMap(coords.i, map) && isColumnInMap(coords.j, map);
}
