export type RGB = {
    red: number;
    green: number;
    blue: number;
}

export const createColor = (red: number, green: number, blue: number) => {
    return  {
        red,
        green,
        blue,
    }
}

const getShiftedPrimaryColor = (color1: number, color2: number, shift: number) => {
    return (color2 - color1) * shift
}

export const getColorBetween = (color1: RGB, color2: RGB, shift: number) => {
    const redShift = getShiftedPrimaryColor(color1.red, color2.red, shift);
    const greenShift = getShiftedPrimaryColor(color1.red, color2.red, shift);
    const blueShift = getShiftedPrimaryColor(color1.red, color2.red, shift);

    return createColor(
        color2.red - redShift,
        color2.green - greenShift,
        color2.blue - blueShift,
    )
}