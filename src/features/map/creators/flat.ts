import { Cell, createCell } from "../../../common/cell"
import { formMap, MapCreator, Size } from "../../../common/map"

const createFlatRow = (width: number): Cell[] => {
    const row: Cell[] = [];

    for (let j = 0; j < width; j++) {
        row.push(createCell());
    }

    return row;
}

const flat: MapCreator = (size: Size) => {
    const cellMatrix: Cell[][] = [];

    for (let i = 0; i < size.height; i++) {
        cellMatrix.push(createFlatRow(size.width));
    }

    return formMap(cellMatrix);
}

export default flat;