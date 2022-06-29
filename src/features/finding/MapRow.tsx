import React from "react";
import { useAppSelector } from "../../app/hooks";
import { Coords, createCoords } from "../../common/coords";
import { selectMapRow } from "./findingSlice";
import MapCell from "./MapCell";

type MapRowInfo = {
    row: number;
    onCellChanged: (coords: Coords) => any;
}

const MapRow = React.memo((props: MapRowInfo) => {
    const rowData = useAppSelector(state => selectMapRow(state, props.row));

    const cells = [];

    for (let column = 0; column < rowData.length; column++) {
        cells.push(<MapCell key={column}
            cell={rowData[column]}
            coords={createCoords(props.row, column)}
            onCellChanged={props.onCellChanged} />)
    }

    return <tr>
        {cells}
    </tr>
});

export default MapRow;