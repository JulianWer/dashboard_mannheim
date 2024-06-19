import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import * as d3 from "d3";
import {getStationData} from "../utils/DataHandler.ts";
import {IStation, StationData, TimeTemp} from "./Dashboard.tsx";

interface ILineChart {
    date: string;
    displayedStations: IStation[];
    selectedStations: IStation[];
    setSelectedStations: React.Dispatch<React.SetStateAction<IStation[] | undefined>>;
}

export default function LineChart(props: ILineChart) {
    const {date, displayedStations, selectedStations, setSelectedStations} = props;
    const [selectedStationsData, setSelectedStationsData] = useState<IStation[]>([]);

    const selectedStationsIds = useMemo(() => {
        return displayedStations.map((station: IStation): string => station.stationsId);
    }, [displayedStations]);

    const fetchData = useCallback(async () => {
        const data: StationData = await getStationData(date);
        const dataForSelectedStations = displayedStations.length === 0
            ? Object.values(data)
            : Object.values(data).filter((station: IStation): boolean => selectedStationsIds.includes(station.stationsId));

        const cleanedDataForSelectedStations = dataForSelectedStations.map((station: IStation): IStation => {
            return {
                ...station,
                temperaturesWithTimestamp: station.temperaturesWithTimestamp.filter((temp: TimeTemp): boolean => temp.temperature !== -999.0),
            };
        });

        setSelectedStationsData(cleanedDataForSelectedStations);
    }, [date, selectedStationsIds, displayedStations.length]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getColor = (stationID: string): string => {
        const baseColor: string = "black";
        if (selectedStations?.length > 0) {
            const isSelected: boolean = selectedStations.some((station: IStation): boolean => station.stationsId === stationID);

            if (isSelected) {
                return baseColor;
            } else {
                // const {r, g, b} = d3.color(baseColor).rgb();
                // return `rgba(${r},${g},${b},0.25)`;
                return "rgba(100, 100, 100, 0.10)"
            }
        } else {
            return baseColor;
        }
    };

    const handleClick = useCallback((event: React.MouseEvent<SVGPathElement, MouseEvent>, clickedStation: IStation): void => {
        const isAlreadySelected = selectedStations.some((station: IStation): boolean => station.stationsId === clickedStation.stationsId);

        if (selectedStations.length === 0) {
            setSelectedStations([clickedStation]);
        } else if (event.metaKey || event.ctrlKey) {
            if (isAlreadySelected) {
                setSelectedStations(selectedStations.filter((station: IStation): boolean => !(station.stationsId === clickedStation.stationsId)));
            } else {
                setSelectedStations((prev: IStation[]): IStation[] => [...prev, clickedStation]);
            }
        }
    }, [setSelectedStations, selectedStations]);

    const margin = {top: 20, right: 0, bottom: 70, left: 35};
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const height = (35 * vh) / 100 - margin.top - margin.bottom;
    const width = (30 * vw) / 100 - margin.left - margin.right;

    const xRef = useRef<SVGGElement>(null);
    const yRef = useRef<SVGGElement>(null);

    const scaleStartDate: Date = new Date(`${date}T00:00:00+02:00`);
    scaleStartDate.setHours(scaleStartDate.getHours() - 12);
    const scaleEndDate: Date = new Date(`${date}T12:00:00+02:00`);

    const xTimeScale = useMemo(() => d3.scaleTime().domain([scaleStartDate, scaleEndDate]).range([0, width]), [scaleStartDate, scaleEndDate, width]);
    const yScale = useMemo(() => d3.scaleLinear().domain([10, 30]).range([height, 0]), [height]);

    useEffect(() => {
        if (xRef.current) d3.select(xRef.current).call(d3.axisBottom(xTimeScale));
        if (yRef.current) d3.select(yRef.current).call(d3.axisLeft(yScale));
    }, [xTimeScale, yScale]);

    const drawLine = d3.line<TimeTemp>()
        .x((d: TimeTemp) => xTimeScale(d.timestamp))
        .y((d: TimeTemp) => yScale(d.temperature));

    return (
        <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
            <g transform={`translate(${margin.left},${margin.top})`}>
                <g ref={xRef} transform={`translate(0, ${height})`}/>
                <text x={width / 2} y={height + margin.top + 20} textAnchor="middle" fill="black" fontSize="14px">
                    Time
                </text>
                <g ref={yRef}/>
                <text x={-margin.top - 25} y={-margin.left + 5} textAnchor="middle" transform="rotate(-90)" fill="black"
                      fontSize="14px">
                    Temperature in °C
                </text>
                {selectedStationsData.map((station, index) => (
                    <path
                        key={index}
                        fill="none"
                        stroke={getColor(station.stationsId)}
                        strokeWidth="1.5"
                        d={drawLine(station.temperaturesWithTimestamp)}
                        onClick={(event) => handleClick(event, station)}
                    />
                ))}
            </g>
        </svg>
    );
}
