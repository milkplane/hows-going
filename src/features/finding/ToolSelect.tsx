import { CellType } from "../../common/cell";
import createTool from "../../common/createTool";
import block from '../../images/block.png';
import water from '../../images/water.png';
import increase from '../../images/groundUp.png';
import decrease from '../../images/groundDown.png';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toolChanged } from "./findingSlice";
import { Col, Row } from "antd";
import styled from "styled-components";

const toolsInfo = [
    {
        id: 1,
        img: block,
        tool: createTool(0, 0, 0, CellType.Bush),
    },
    {
        id: 2,
        img: water,
        tool: createTool(2, 0, 0, CellType.Water),
    },
    {
        id: 3,
        img: increase,
        tool: createTool(3, 0, 0.03, null),
    },
    {
        id: 4,
        img: decrease,
        tool: createTool(3, 0, -0.03, null),
    },
]

const ToolButton = styled.button`
    background-color: transparent;
    border: none;
    width: 25%;
    cursor: pointer;
    opacity: ${props => props.disabled ? 1: 0.5};

    :hover {
        opacity: 1;
    }
`

const ToolSelect = () => {
    const dispatch = useAppDispatch();
    const selectedTool = useAppSelector(state => state.tool);

    const buttons = toolsInfo.map(toolInfo => {
        return <ToolButton key={toolInfo.id} onClick={() => dispatch(toolChanged(toolInfo.tool))} disabled={toolInfo.tool === selectedTool}>
            <img style={{width: '100%', height: 'auto'}} src={toolInfo.img} />
        </ToolButton>
    });

    return <Row align="middle">
        <Col span={9}>
            <p>Инструменты</p>
        </Col>
        <Col span={15}>
            {buttons}
        </Col>
    </Row>
}

export default ToolSelect;