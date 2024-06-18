import {getStationData} from "../utils/DataHandler.ts";
import {LegacyRef, useCallback, useEffect, useRef, useState} from "react";
import * as d3 from "d3";
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
    const selectedStationsIds: string[] = displayedStations.map((station: IStation): string => station.stationsId);

    const fetchData = useCallback(async () => {
        const data: StationData = await getStationData(date);
        const dataForSelectedStations: IStation[] = displayedStations?.length === 0 ?
            Object.values(data) :
            Object.values(data).filter((station: IStation): boolean => selectedStationsIds.includes(station.stationsId));
        const cleanedDataForSelectedStations: IStation[] = dataForSelectedStations.map((station: IStation): IStation => {
            station.temperaturesWithTimestamp = station.temperaturesWithTimestamp.filter((temp: TimeTemp): boolean => temp.temperature !== -999.0)
            return station;
        });
        setSelectedStationsData(cleanedDataForSelectedStations);
    }, [date, displayedStations.length, selectedStationsIds]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getColor = (stationID: string): string => {
        const baseColor: string = "steelblue";
        if (selectedStations?.length > 0) {
            const isSelected: boolean = selectedStations.some((station: IStation): boolean => station.stationsId === stationID);

            if (isSelected) {
                return baseColor;
            } else {
                // const {r, g, b} = d3.color(baseColor).rgb();
                // return `rgba(${r},${g},${b},0.25)`;
                return "rgba(100, 100, 100, 0.25)"
            }
        } else {
            return baseColor;
        }
    };

    const handleClick = (event: React.MouseEvent<SVGPathElement, MouseEvent>, clickedStation: IStation): void => {
        const isAlreadySelected: boolean = selectedStations?.some((station: IStation): boolean => station.stationsId === clickedStation.stationsId);

        if (selectedStations?.length === 0) {
            setSelectedStations([clickedStation]);
        } else {
            if (event.metaKey || event.ctrlKey) {
                if (isAlreadySelected) {
                    setSelectedStations(selectedStations.filter((station: IStation): boolean => !(station.stationsId === clickedStation.stationsId)));
                } else {
                    setSelectedStations((prev: IStation[]): IStation[] => [...prev, clickedStation]);
                }
            }
        }
    };


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
                {selectedStationsData.map((station: IStation, index: number) => (
                    <path key={index}
                          fill="none"
                          stroke={getColor(station.stationsId)}
                          strokeWidth="1.5"
                          d={drawLine(station.temperaturesWithTimestamp)}
                          onClick={(event: React.MouseEvent<SVGPathElement, MouseEvent>) => handleClick(event, station)}/>
                ))}

            </g>
        </svg>
    );
}