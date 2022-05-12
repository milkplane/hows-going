export enum CellType {
    Ground,
    Water,
    Bush,
}

export type Cell = {
    height: number;
    type: CellType;
}

export const copyCell = (cell: Cell): Cell => {
    return {
        ...cell,
    };
}

const MAX_WATER_HEIGHT = 0 - Number.EPSILON;
const MIN_BUSH_HEIGHT = -0.1 - Number.EPSILON;
const MAX_BUSH_HEIGHT = 0.3 - Number.EPSILON;
const MIN_HEIGHT = -1;
const MAX_HEIGHT = 1;

const getAcceptableHeight = (height: number): number => {
    if (height > MAX_HEIGHT) return MAX_HEIGHT;
    if (height < MIN_HEIGHT) return MAX_HEIGHT;

    return height;
}

const getVerifiedHeight = (height: number, type: CellType): number => {
    const newHeight = getAcceptableHeight(height);

    if (type === CellType.Bush) {
        if (newHeight > MAX_BUSH_HEIGHT) return MAX_BUSH_HEIGHT;
        if (newHeight < MIN_BUSH_HEIGHT) return MAX_BUSH_HEIGHT;
    } else if (type === CellType.Water && newHeight > MAX_WATER_HEIGHT) {
        return MAX_WATER_HEIGHT;
    }

    return newHeight;
}

const shouldBeGround = (height: number, type: CellType): boolean => {
    return type === CellType.Bush && height > MAX_BUSH_HEIGHT ||
    type === CellType.Bush && height < MIN_BUSH_HEIGHT ||
    type === CellType.Water && height > MAX_WATER_HEIGHT;
}

const getVerifiedType = (height: number, type: CellType): CellType => {
    if (shouldBeGround(height, type)) {
        return CellType.Ground;
    }

    return type;
}

export const changeCellType = (cell: Cell, type: CellType): Cell => {
    return {
        height: getVerifiedHeight(cell.height, type),
        type: type,
    }
}

export const changeCellHeight = (cell: Cell, height: number): Cell => {
    const newHeight = getAcceptableHeight(height);
    return {
        height: newHeight,
        type: getVerifiedType(newHeight, cell.type),
    }
}

export const createCell = (height: number = 0, type: CellType = CellType.Ground): Cell => {
    const cell: Cell = {
        height: 0,
        type: type
    }

    return changeCellHeight(cell, height); 
}