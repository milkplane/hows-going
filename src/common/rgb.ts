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

export type Gradient = {
    pointColors: RGB[];
}

export const createGradient = (...colors: RGB[]): Gradient => {
    return {
        pointColors: colors,
    }
}

export const getGradientColor = (gradient: Gradient, shift: number) => {
    if (gradient.pointColors.length === 1) {
        return gradient.pointColors[0];
    }

    const shiftInGradient = (gradient.pointColors.length - 1) * shift; // -1 Last color shouldnt be taken 
    const colorIndex = Math.floor(shiftInGradient);
    const shiftInColor = shiftInGradient - colorIndex;
    const secondColorIndex = colorIndex + 1;

    return getColorBetween(gradient.pointColors[colorIndex], gradient.pointColors[secondColorIndex], shiftInColor);
}