export type Size = {
    width: number;
    height: number;
}

export const createSize = (height: number, width: number): Size => {
    return {
        height,
        width,
    }
}