import { useAppSelector } from "../../app/hooks";
import MapCell from "./MapCell";

type MapRowInfo = {
    row: number;
}

const MapRow = (props: MapRowInfo) => {
    const width = useAppSelector(state => state.map.size.width);

    const cells = [];

    for (let i = 0; i < width; i++) {
        cells.push(<MapCell key={i} row={props.row} column={i}/>)
    }

    return <tr>
        {cells}
    </tr>
}

export default MapRow;