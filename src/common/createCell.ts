export enum CellType {
    Ground,
    Water,
    Bush,
}

type Cell = {
    height: number;
    type: CellType;
}

const createCell = (height: number, type: CellType = CellType.Ground): Cell => {
    return {
        height,
        type,
    }
}

export default createCell;