import {useEffect, useMemo, useRef, useState} from "react";
import * as d3 from "d3";
import moment, {Moment} from "moment-timezone";
import {IStation, StationData, TimeTemp} from "./Dashboard.tsx";

interface ILineChart {
    date: string;
    data: StationData;
    displayedStations: IStation[];
    selectedStations: IStation[];
}

export default function LineChart(props: ILineChart) {
    const {date, displayedStations, selectedStations, data} = props;
    const [displayedStationsData, setDisplayedStationsData] = useState<IStation[]>([]);
    const [tempScaleMinMax, setTempScaleMinMax] = useState<number[]>([]);

    const displayedStationsIds = useMemo(() => {
        return displayedStations.map((station: IStation): string => station.stationsId);
    }, [displayedStations]);


    const dataForDisplayedStations = useMemo(() => displayedStations.length === 0
        ? Object.values(data)
        : Object.values(data).filter((station: IStation): boolean => displayedStationsIds.includes(station.stationsId)), [data, displayedStations, displayedStationsIds]);

    const cleanedDataForDisplayedStations = useMemo(() => {
        return dataForDisplayedStations.map((station: IStation): IStation => {
            return {
                ...station,
                temperaturesWithTimestamp: station.temperaturesWithTimestamp.filter((temp: TimeTemp): boolean => temp.temperature !== -999.0),
                temperatures: station.temperatures.filter((temp: number): boolean => temp !== -999.0)
            };
        })
    }, [dataForDisplayedStations]);

    useEffect(() => {
        const allTemperatures: number[] = cleanedDataForDisplayedStations.map((station: IStation): number[] => station.temperatures).flat();
        const scaleMinMax: number[] = d3.extent(allTemperatures);
        scaleMinMax[0] = scaleMinMax[0] - 1;
        scaleMinMax[1] = scaleMinMax[1] + 1;

        setTempScaleMinMax(scaleMinMax);
        setDisplayedStationsData(cleanedDataForDisplayedStations);
    }, [cleanedDataForDisplayedStations]);

    const getColor = (stationID: string): string => {
        const baseColor: string = "black";
        if (selectedStations?.length > 0) {
            const isSelected: boolean = selectedStations.some((station: IStation): boolean => station.stationsId === stationID);

            if (isSelected) {
                return baseColor;
            } else {
                return "rgba(100, 100, 100, 0.10)"
            }
        } else {
            return baseColor;
        }
    };


    const margin = {top: 20, right: 0, bottom: 70, left: 30};
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const height = (35 * vh) / 100 - margin.top - margin.bottom;
    const width = (30 * vw) / 100 - margin.left - margin.right;

    const xRef = useRef<SVGGElement>(null);
    const yRef = useRef<SVGGElement>(null);
    const gridRef = useRef<SVGGElement>(null);

    const scaleEndDate: Moment = moment.tz(`${date} 12:00:00`, "Europe/Berlin");
    const scaleStartDate: Moment = moment(scaleEndDate).subtract(24, "hours");

    const xTimeScale = useMemo(() => d3.scaleTime().domain([scaleStartDate.toDate(), scaleEndDate.toDate()]).range([0, width]), [scaleStartDate, scaleEndDate, width]);
    const yScale = useMemo(() => d3.scaleLinear().domain(tempScaleMinMax).range([height, 0]), [height, tempScaleMinMax]);

    useEffect(() => {
        if (xRef.current) d3.select(xRef.current).call(d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%H:%M")));
        if (yRef.current) d3.select(yRef.current).call(d3.axisLeft(yScale));

        // Add gridlines
        if (gridRef.current) {
            d3.select(gridRef.current)
                .call(d3.axisLeft(yScale)
                    .tickSize(-width)
                    .tickFormat(() => '')
                )
                .selectAll("line")
                .style("stroke", "lightgrey")
                .style("stroke-width", "0.5");
        }
        d3.select(gridRef.current).select(".domain").remove();
    }, [xTimeScale, yScale, width]);

    const drawLine = d3.line<TimeTemp>()
        .x((d: TimeTemp) => xTimeScale(d.timestamp))
        .y((d: TimeTemp) => yScale(d.temperature));

    // Calculate the position for the highlighted area
    const highlightStartTime: Date = moment.tz(`${date} 05:30:00`, "Europe/Berlin").toDate();
    const highlightEndTime: Date = moment.tz(`${date} 06:30:00`, "Europe/Berlin").toDate();
    const highlightXStart: number = xTimeScale(highlightStartTime);
    const highlightXEnd: number = xTimeScale(highlightEndTime);

    // Calculate the position for the midnight line
    const midnightTime: Date = moment.tz(`${date} 00:00:00`, "Europe/Berlin").toDate();
    const midnightX: number = xTimeScale(midnightTime);

    return (
        <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
            <g transform={`translate(${margin.left},${margin.top})`}>
                <g ref={xRef} transform={`translate(0, ${height})`}/>
                <text x={width * 0.75} y={height + margin.top + 20} textAnchor="middle" fill="black" fontSize="14px">
                    {moment(date).format("DD.MM.YYYY")}
                </text>
                <text x={width * 0.25} y={height + margin.top + 20} textAnchor="middle" fill="black" fontSize="14px">
                    {moment(date).subtract(1, 'days').format("DD.MM.YYYY")}
                </text>
                <g ref={yRef}/>
                <g ref={gridRef}/>
                <text
                    x={-margin.left + 10}
                    y={-margin.top + 15}
                    textAnchor="middle"
                    fill="black"
                    fontSize="14px">
                    °C
                </text>

                {/* Highlighted rectangle for 5:30 AM to 6:30 AM */}
                <rect
                    x={highlightXStart}
                    y={0}
                    width={highlightXEnd - highlightXStart}
                    height={height}
                    fill="rgba(255, 165, 0, 0.3)"

                />

                {/* Dotted line at midnight */}
                <line
                    x1={midnightX}
                    y1={0}
                    x2={midnightX}
                    y2={height}
                    stroke="black"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                />

                {displayedStationsData.map((station, index) => (
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
