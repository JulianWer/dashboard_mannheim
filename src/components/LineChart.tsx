import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import * as d3 from "d3";
import moment, {Moment} from "moment-timezone";
import {IStation, StationData, TimeTemp} from "./Dashboard.tsx";
import {getStationData} from "@/utils/DataHandler.ts";

interface ILineChart {
    date: string;
    displayedStations: IStation[];
    selectedStations: IStation[];
}

export default function LineChart(props: ILineChart) {
    const {date, displayedStations, selectedStations} = props;
    const [data, setData] = useState<StationData>({});
    const [selectedStationsData, setSelectedStationsData] = useState<IStation[]>([]);

    const selectedStationsIds = useMemo(() => {
        return displayedStations.map((station: IStation): string => station.stationsId);
    }, [displayedStations]);

    const fetchData = useCallback(async () => {
        const data: StationData = await getStationData(date);
        setData(data);
    }, [date]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const dataForSelectedStations = useMemo(() => displayedStations.length === 0
        ? Object.values(data)
        : Object.values(data).filter((station: IStation): boolean => selectedStationsIds.includes(station.stationsId)), [data, displayedStations, selectedStationsIds]);

    const cleanedDataForSelectedStations = useMemo(() => {
        return dataForSelectedStations.map((station: IStation): IStation => {
            return {
                ...station,
                temperaturesWithTimestamp: station.temperaturesWithTimestamp.filter((temp: TimeTemp): boolean => temp.temperature !== -999.0),
            };
        })
    }, [dataForSelectedStations]);

    useEffect(() => {
        setSelectedStationsData(cleanedDataForSelectedStations);
    }, [cleanedDataForSelectedStations]);

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


    const margin = {top: 20, right: 0, bottom: 70, left: 35};
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const height = (35 * vh) / 100 - margin.top - margin.bottom;
    const width = (30 * vw) / 100 - margin.left - margin.right;

    const xRef = useRef<SVGGElement>(null);
    const yRef = useRef<SVGGElement>(null);

    const scaleEndDate: Moment = moment.tz(`${date} 12:00:00`, "Europe/Berlin");
    const scaleStartDate: Moment = moment(scaleEndDate).subtract(24, "hours");

    const xTimeScale = useMemo(() => d3.scaleTime().domain([scaleStartDate.toDate(), scaleEndDate.toDate()]).range([0, width]), [scaleStartDate, scaleEndDate, width]);
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
                    />
                ))}
            </g>
        </svg>
    );
}
