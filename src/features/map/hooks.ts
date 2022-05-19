import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useState } from "react";
import { MouseEvent } from "react";
import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { areEqualCoords, Coords } from "../../common/coords";
import { toolApplied } from "./mapSlice";

export const useTool = (coords: Coords) => {
    const dispatch = useAppDispatch();
    const [isMapPressed, setIsMapPressed] = useState<boolean>(false);

    const onMapPressed = (event: MouseEvent<HTMLTableSectionElement>) => {
        event.preventDefault();
        setIsMapPressed(true);
        document.addEventListener('mouseup', () => setIsMapPressed(false));
    }

    useEffect(() => {
        if (!isMapPressed) return;

        dispatch(toolApplied(coords));

        const timer = setInterval(() => {
            dispatch(toolApplied(coords));
        }, 1000 / 2);

        return () => {
            clearInterval(timer);
        }

    }, [isMapPressed, coords])

    return onMapPressed;
}


export const useGameObjectDrag = (objectPosition: Coords, hoveredCell: Coords, objectChanged: ActionCreatorWithPayload<Coords, string>) => {
    const dipatch = useAppDispatch();
    const [isObjectChanging, setIsObjectChanging] = useState<boolean>(false);

    const onGameObjectPressed = (event: MouseEvent<HTMLTableSectionElement>) => {
        event.preventDefault();

        setIsObjectChanging(true);
        document.addEventListener('mouseup', () => setIsObjectChanging(false));
    }

    useEffect(() => {
        if (!isObjectChanging) return;

        dipatch(objectChanged(hoveredCell));

        return () => {

        }
    }, [isObjectChanging, hoveredCell]);


    return onGameObjectPressed;
}