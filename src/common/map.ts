import { Cell, changeCellHeight, changeCellType, copyCell, increaseCellHeight } from "./cell";
import { Coords } from "./coords";
import { Tool } from "./createTool";
import { createSize, Size } from "./size";
import { arrayFromTree, createTree, expandTree } from "./tree";

export type MapData = Cell[][];

export type MapCreator = (size: Size) => MapData;

export type MapChange = {
    coords: Coords;
    newCell: Cell;
}

export type MapChanges = MapChange[];

export const formMap = (cellMatrix: Cell[][]): MapData => {
    return cellMatrix;
}

export const createMap = (create: MapCreator, size: Size) => {
    return create(size);
}

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

const getChangesFromTool = (map: MapData, tool: Tool, coords: Coords): MapChanges => {
    const canExpandTo = (coords: Coords) => isInMap(coords, map);
    const toolAreaRoot = expandTree(createTree(coords), tool.size, canExpandTo);
    const getPressure = (distanceFromCenter: number) => (tool.size + 1 - distanceFromCenter) * tool.increaseRate;
    const pressureInfos = arrayFromTree<number>(toolAreaRoot, getPressure);
    return pressureInfos.map((info) => {
        const tooledHeight = info.mappedValue;
        const cell = increaseCellHeight(map[info.coords.i][info.coords.j], tooledHeight);

        if (tool.brushType) {
            return {
                coords: info.coords,
                newCell: changeCellType(cell, tool.brushType),
            }
        }

        return {
            coords: info.coords,
            newCell: cell,
        }
    })
}

export const createAppliedToolMap = (map: MapData, tool: Tool, coords: Coords): MapData => {
    const copiedMap = copyMap(map);
    const changesFromTool = getChangesFromTool(map, tool, coords);

    changesFromTool.forEach(change => {
        copiedMap[change.coords.i][change.coords.j] = copyCell(change.newCell);
    });

    return copiedMap;
}

export const getCell = (map: MapData, coords: Coords) => {
    return map[coords.i][coords.j]
}

export const getMapSize = (map: MapData) => {
    if (!map || !map[0]) return createSize(0, 0);
    
    return createSize(map.length, map[0].length);
}