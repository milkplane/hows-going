import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useState } from "react";
import { MouseEvent } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { areEqualCoords, Coords } from "../../common/coords";
import { createMap } from "../../common/map";
import { createSize } from "../../common/size";
import { mapChanged, oneStepSearch, toolApplied } from "./findingSlice";
import flat from "./mapCreators/flat";

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
        }, 1000 / 100);

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


export const useSearch = (rate: number) => {
    const isSearhing = useAppSelector(state => state.isSearhing);
    const isPavingWay = useAppSelector(state => state.isPavingWay)
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!isSearhing && !isPavingWay) return;

        const timer = setInterval(() => {
            dispatch(oneStepSearch());
        }, 1000 / rate)


        return () => {
            clearInterval(timer);
        }


    }, [isSearhing, isPavingWay, rate])
}


export const useMapResize = <T extends HTMLElement>(dividingSquareSideLength: number) => {
    const containerRef = useRef<T>(null);
    const dispatch = useDispatch();

    const resizeMap = () => {
        if (!containerRef.current) return;

        const newSize = createSize(
            Math.floor(containerRef.current.clientHeight / dividingSquareSideLength),
            Math.floor(containerRef.current.clientWidth / dividingSquareSideLength),
        );
        dispatch(mapChanged(createMap(flat, newSize)))
    }

    useEffect(() => {
        resizeMap();
        window.addEventListener("resize", () => {
            resizeMap();
        })
    }, [containerRef.current])

    return containerRef;
}