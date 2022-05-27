import React from "react";
import { useAppSelector } from "../../app/hooks";
import { areEqualCells, Cell, CellColorGetter, CellType, getCellColor } from "../../common/cell";
import { areEqualCoords, Coords, stringifyCoords } from "../../common/coords";
import endImage from '../../images/treasure-chest.png'
import startImage from '../../images/person.png'
import styled, { css } from "styled-components";
import { createColor, createGradient, createGradientPoint, getColorBetween, stringifyColor } from "../../common/rgb";

type CellProps = {
    coords: Coords;
    cell: Cell;
    onCellChanged: (coords: Coords) => any;
}

const Tile = styled.td`
    position: relative;
`

const gameObject = css`
    background-size: 100% 100%; 
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: 10%;
`

const StartImage = styled.div`
    ${gameObject}
    background-image: url(${startImage});
`

const EndImage = styled.div`
    ${gameObject}
    background-image: url(${endImage});

`

const groundColor = createGradient(
    createGradientPoint(createColor(155, 118, 83), 0),
    createGradientPoint(createColor(255, 253, 234), 0.5),
    createGradientPoint(createColor(192, 184, 172), 0.75),
    createGradientPoint(createColor(246, 245, 243), 1)
)

const waterColor = createGradient(
    createGradientPoint(createColor(140, 222, 255), 0),
    createGradientPoint(createColor(205, 237, 247), 1)
)

const bushColor = createGradient(
    createGradientPoint(createColor(187, 232, 183), 1)
)

const getTypedColor: CellColorGetter = (type: CellType) => {
    if (type === CellType.Bush) return bushColor;
    if (type === CellType.Water) return waterColor;
    return groundColor;
}

const primaryPath = createColor(209, 164, 105);
const primaryVisited = createColor(199, 199, 197);

const MapCell = React.memo((props: CellProps) => {
    const isStart = useAppSelector(state => areEqualCoords(props.coords, state.start));
    const isEnd = useAppSelector(state => areEqualCoords(props.coords, state.end));
    const searchInfo = useAppSelector(state => state.findingCoordsInfo[stringifyCoords(props.coords)]);
    let terrainColor = getCellColor(props.cell, getTypedColor);

    if (searchInfo) {
        terrainColor = searchInfo.isViewed ? getColorBetween(primaryVisited, terrainColor, 0.5) : terrainColor;
        terrainColor = searchInfo.isPath ? getColorBetween(primaryPath, terrainColor, 0.5) : terrainColor;
    }

    const handleCellChanged = () => {
        props.onCellChanged(props.coords);
    }

    return <Tile onMouseEnter={handleCellChanged} style={{ backgroundColor: stringifyColor(terrainColor) }}>
        {isStart ? <StartImage /> : null}
        {isEnd ? <EndImage /> : null}
    </Tile>
}, (prevProps, nextProps) => {
    return areEqualCells(prevProps.cell, nextProps.cell) &&
        areEqualCoords(prevProps.coords, nextProps.coords);
})

export default MapCell;