import { getGradientColor, Gradient } from "./rgb";

export const MAX_WATER_HEIGHT = -0.07 - Number.EPSILON;
export const MIN_BUSH_HEIGHT = -0.1 - Number.EPSILON;
export const MAX_BUSH_HEIGHT = 0.3 - Number.EPSILON;
export const MIN_HEIGHT = -1;
export const MAX_HEIGHT = 1;

export enum CellType {
    Ground,
    Water,
    Bush,
}

export type Cell = {
    height: number;
    type: CellType;
}

export type CellColorGetter = (type: CellType) => Gradient;

export const copyCell = (cell: Cell): Cell => {
    return {
        ...cell,
    };
}

const getAllowedHeight = (height: number): number => {
    if (height > MAX_HEIGHT) return MAX_HEIGHT;
    if (height < MIN_HEIGHT) return MIN_HEIGHT;

    return height;
}

const changeHeightForType = (height: number, type: CellType): number => {
    const allowedHeight = getAllowedHeight(height);

    if (type === CellType.Bush) {
        if (allowedHeight > MAX_BUSH_HEIGHT) return MAX_BUSH_HEIGHT;
        if (allowedHeight < MIN_BUSH_HEIGHT) return MAX_BUSH_HEIGHT;
    } else if (type === CellType.Water && allowedHeight > MAX_WATER_HEIGHT) {
        return MAX_WATER_HEIGHT;
    }

    return allowedHeight;
}

const shouldBeGround = (height: number, type: CellType): boolean => {
    return type === CellType.Bush && height > MAX_BUSH_HEIGHT ||
        type === CellType.Bush && height < MIN_BUSH_HEIGHT ||
        type === CellType.Water && height > MAX_WATER_HEIGHT;
}

const changeTypeForHeight = (height: number, type: CellType): CellType => {
    if (shouldBeGround(height, type)) {
        return CellType.Ground;
    }

    return type;
}

export const changeCellType = (cell: Cell, type: CellType): Cell => {
    return {
        height: changeHeightForType(cell.height, type),
        type: type,
    }
}

export const changeCellHeight = (cell: Cell, height: number): Cell => {
    const newHeight = getAllowedHeight(height);
    return {
        height: newHeight,
        type: changeTypeForHeight(newHeight, cell.type),
    }
}

export const createCell = (height: number = 0, type: CellType = CellType.Ground): Cell => {
    const cell: Cell = {
        height: 0,
        type: type
    }

    return changeCellHeight(cell, height);
}

export const increaseCellHeight = (cell: Cell, value: number) => {
    return createCell(cell.height + value, cell.type);
}

export const getRoughness = (cell: Cell, waterMultiplier: number = 50) => {
    let groundRoughness = Math.abs(cell.height) + 1;

    if (cell.type === CellType.Water) groundRoughness *= waterMultiplier;

    return groundRoughness;
}

const getMinMaxHeight = (type: CellType) => {
    let minHeight = MIN_HEIGHT;
    let maxHeight = MAX_HEIGHT;

    switch (type) {
        case CellType.Bush: {
            return [MIN_BUSH_HEIGHT, MAX_BUSH_HEIGHT];
        }
        case CellType.Water: {
            return [MIN_HEIGHT, MAX_WATER_HEIGHT];
        }
    }

    return [minHeight, maxHeight];
}

export const getShiftInHeight = (cell: Cell) => {
    const [minHeight, maxHeight] = getMinMaxHeight(cell.type);
    return Math.abs((cell.height - minHeight) / (maxHeight - minHeight));
}

export const getCellColor = (cell: Cell, getGradient: CellColorGetter) => {
    const color = getGradient(cell.type);
    const shift = getShiftInHeight(cell);
    return getGradientColor(color, shift);
}

export const isCellHeightAllowed = (height: number, type: CellType) => {
    const minMax = getMinMaxHeight(type);
    if (height < minMax[0]) return false;
    if (height > minMax[1]) return false;
    return true;
}

export const createMoisturedCell = (cell: Cell) => {
    if (isCellHeightAllowed(cell.height, CellType.Water)) {
        return createCell(cell.height, CellType.Water)
    }

    return createCell(cell.height);
}

export const getCellType = (cell: Cell) => cell.type;

export const areEqualCells = (cell1: Cell, cell2: Cell) => {
    return cell1.height === cell2.height && cell1.type === cell2.type;
}