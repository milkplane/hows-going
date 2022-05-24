import React from "react";
import { useAppSelector } from "../../app/hooks";
import { areEqualCoords, Coords } from "../../common/coords";
import MapCell from "./MapCell";

type MapRowInfo = {
    row: number;
    onCellChanged: (coords: Coords) => any;
}

const MapRow = React.memo((props: MapRowInfo) => {
    const rowData = useAppSelector(state => state.map[props.row]);

    const cells = [];

    for (let i = 0; i < rowData.length; i++) {
        cells.push(<MapCell key={i}
            height={rowData[i].height}
            type={rowData[i].type}
            row={props.row}
            column={i}
            onCellChanged={props.onCellChanged} />)
    }

    return <tr>
        {cells}
    </tr>
});

export default MapRow;