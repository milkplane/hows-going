import { CellType } from "../../common/cell";
import createTool from "../../common/createTool";
import block from '../../images/block.png';
import water from '../../images/water.png';
import increase from '../../images/groundUp.png';
import decrease from '../../images/groundDown.png';
import { useAppDispatch } from "../../app/hooks";
import { toolChanged } from "./findingSlice";

const toolsInfo = [
    {
        id: 1,
        img: block,
        tool: createTool(0, 0, 0, CellType.Bush),
    },
    {
        id: 2,
        img: water,
        tool: createTool(0, 0, 0, CellType.Water),
    },
    {
        id: 3,
        img: increase,
        tool: createTool(2, 0.02, 0.01, null),
    },
    {
        id: 4,
        img: decrease,
        tool: createTool(2, -0.02, -0.01, null),
    },
]

const ToolSelect = () => {
    const dispatch = useAppDispatch();

    const buttons = toolsInfo.map(toolInfo => {
        return <button key={toolInfo.id} onClick={() => dispatch(toolChanged(toolInfo.tool))}>
            <img src={toolInfo.img} />
        </button>
    });

    return <div>
        <p>Инструменты</p>
        {buttons}
    </div>
}

export default ToolSelect;