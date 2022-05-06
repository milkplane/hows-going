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

const createCell = (height: number, type: CellType = CellType.Ground): Cell => {
    return {
        height,
        type,
    };
}