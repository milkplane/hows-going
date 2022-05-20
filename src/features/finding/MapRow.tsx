import { useAppSelector } from "../../app/hooks";
import { Coords } from "../../common/coords";
import MapCell from "./MapCell";

type MapRowInfo = {
    row: number;
    onCellChanged: (coords: Coords) => any;
}

const MapRow = (props: MapRowInfo) => {
    const width = useAppSelector(state => state.size.width);

    const cells = [];

    for (let i = 0; i < width; i++) {
        cells.push(<MapCell key={i} row={props.row} column={i} onCellChanged={props.onCellChanged}/>)
    }

    return <tr>
        {cells}
    </tr>
}

export default MapRow;