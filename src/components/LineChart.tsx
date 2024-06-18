import {getStationData} from "../utils/DataHandler.ts";
import {LegacyRef, useCallback, useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import {IStation, StationData, TimeTemp} from "./Dashboard.tsx";

interface ILineChart {
    date: string
}

export default function LineChart(props: ILineChart) {
    const {date} = props;
    const [temperaturesWithTimestampOneStation, setTemperaturesWithTimestampOneStation] = useState<TimeTemp[]>([]);

    const fetchData = useCallback(async () => {
        const data: StationData = await getStationData(date);
        const dataForOneStation: IStation[] = Object.values(data).filter((station: IStation): boolean => station.stationsId === "015");
        // let temperatures: number[] = dataForOneStation[0].temperatures;
        // temperatures = temperatures.filter((temp) => temp !== -999.0);
        let temperaturesWithTimestamp: TimeTemp[] = dataForOneStation[0].temperaturesWithTimestamp;
        temperaturesWithTimestamp = temperaturesWithTimestamp.filter((temp: TimeTemp): boolean => temp.temperature !== -999.0);
        setTemperaturesWithTimestampOneStation(temperaturesWithTimestamp);
    }, [date]);

    useEffect(() => {
        fetchData();
    }, [fetchData])


    const margin = {top: 10, right: 30, bottom: 30, left: 60};
    const width: number = 460 - margin.left - margin.right;
    const height: number = 400 - margin.top - margin.bottom;

    const x = useRef<SVGSVGElement>();
    const y = useRef<SVGSVGElement>();

    const scaleStartDate: Date = new Date(date + "T00:00:00+02:00");
    scaleStartDate.setHours(scaleStartDate.getHours() - 12);
    const scaleEndDate: Date = new Date(date + "T12:00:00+02:00");

    const xTimeScale = d3
        .scaleTime()
        .domain([scaleStartDate, scaleEndDate])
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        // .domain(d3.extent(temperatures) as [number, number])
        .domain([0, 40])
        .range([height, 0]);

    useEffect(() => {
        d3.select(x.current).call(d3.axisBottom(xTimeScale));
        d3.select(y.current).call(d3.axisLeft(yScale));
    }, [x, y, xTimeScale, yScale]);

    const drawLine = d3.line<TimeTemp>()
        .x((d: TimeTemp) => xTimeScale(d.timestamp))
        .y((d: TimeTemp) => yScale(d.temperature));

    return (
        <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
            <g transform={`translate(${margin.left},${margin.top})`}>
                {/* x-Achsen-Beschriftung */}
                <g ref={x as unknown as LegacyRef<SVGGElement> | undefined} transform={`translate(0, ${height})`}/>
                <text
                    x={width / 2}
                    y={height + margin.top + 20}
                    textAnchor="middle"
                    fill="black"
                    fontSize="14px"
                >
                    Time
                </text>

                {/* y-Achsen-Beschriftung */}
                <g ref={y as unknown as LegacyRef<SVGGElement> | undefined}/>
                <text
                    x={-margin.left - 70}
                    y={-margin.top - 25}
                    textAnchor="middle"
                    transform={`rotate(-90)`}
                    fill="black"
                    fontSize="14px"
                >
                    Temperature in °C
                </text>
                <path fill="none" stroke="steelblue" strokeWidth="1.5" d={drawLine(temperaturesWithTimestampOneStation)}/>
            </g>
        </svg>
    );
}