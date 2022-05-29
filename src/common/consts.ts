import flat from "../features/finding/mapCreators/flat";
import maze from "../features/finding/mapCreators/maze";
import random from "../features/finding/mapCreators/random";
import createTool from "./createTool";
import block from '../images/block.png';
import water from '../images/water.png';
import increase from '../images/groundUp.png';
import decrease from '../images/groundDown.png';
import { Selectable } from "./ObjectSelect";
import { CellType } from "./cell";

export const mapCreatorInfos: Selectable[] = [
    {
        id: 1,
        toString: () => "Лабиринт",
        value: maze,
    },
    {
        id: 2,
        toString: () => "Случайная поверхонсть",
        value: random,
    },
    {
        id: 3,
        toString: () => "Плоская поверхонсть",
        value: flat,
    },

]

export const toolsInfo = [
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