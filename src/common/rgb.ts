export type RGB = {
    red: number;
    green: number;
    blue: number;
}

export const createColor = (red: number, green: number, blue: number) => {
    return {
        red,
        green,
        blue,
    }
}

const getShiftedPrimaryColor = (color1: number, color2: number, shift: number) => {
    return (color2 - color1) * shift + color1;
}

export const getColorBetween = (color1: RGB, color2: RGB, shift: number): RGB => {
    const redShift = getShiftedPrimaryColor(color1.red, color2.red, shift);
    const greenShift = getShiftedPrimaryColor(color1.green, color2.green, shift);
    const blueShift = getShiftedPrimaryColor(color1.blue, color2.blue, shift);

    return createColor(
        redShift,
        greenShift,
        blueShift
    )
}

export type GradientPoint = {
    color: RGB;
    shift: number;
}

export type Gradient = {
    pointColors: GradientPoint[];
}

export const createGradientPoint = (color: RGB, shift: number) => {
    return {
        color,
        shift,
    }
}

export const createGradient = (...colors: GradientPoint[]): Gradient => {
    return {
        pointColors: colors,
    }
}

export const getGradientColor = (gradient: Gradient, shift: number): RGB => {
    if (gradient.pointColors.length === 1) {
        return gradient.pointColors[0].color;
    }

    const secondColorIndex = gradient.pointColors.findIndex((colorPoint) => {
        return colorPoint.shift >= shift;
    });

    if (secondColorIndex === 0) return gradient.pointColors[secondColorIndex].color;

    const firstColorIndex = secondColorIndex - 1;
    const firstColorPoint = gradient.pointColors[firstColorIndex];
    const secondColorPoint = gradient.pointColors[secondColorIndex];
    const shiftInColor = (shift - firstColorPoint.shift) / (secondColorPoint.shift - firstColorPoint.shift);

    return getColorBetween(firstColorPoint.color, secondColorPoint.color, shiftInColor);
}

export const stringifyColor = (color: RGB) => {
    return `rgb(${color.red}, ${color.green}, ${color.blue})`;
}