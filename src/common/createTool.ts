import { CellType } from "./cell";

export type Tool = {
    size: number;
    instantHeightIncrease: number;
    increaseRate: number;
    brushType: CellType | null;
}

const createTool = (size: number, instantHeightIncrease: number, increaseRate: number, brushType: CellType | null): Tool => {
    return {
        size,
        instantHeightIncrease,
        increaseRate,
        brushType,
    }
}

export const createBrush = (size: number, brushType: CellType): Tool => {
    return createTool(size, 0, 0, brushType);
}

export const createTerrainTool = (size: number, instantHeightIncrease: number, increaseRate: number): Tool => {
    return createTool(size, instantHeightIncrease, increaseRate, null);
}

export default createTool;