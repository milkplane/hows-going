import { useState } from "react";
import { MouseEvent } from "react";
import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { Coords } from "../../common/coords";
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

        return  () => {
            clearInterval(timer);
        }
        
    }, [isMapPressed, coords])

    return onMapPressed;
}