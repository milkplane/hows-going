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

export const toStringSize = (size: Size) => `${size.height}-${size.width}`