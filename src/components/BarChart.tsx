import * as d3 from "d3";
import { LegacyRef, useEffect, useRef } from "react";
import { getStationData } from "../utils/DataHandler.ts"
import { IStation } from "./Dashboard.tsx";


interface IBarchart {
    selectedStations: IStation[] | undefined
    setSelectedStations: React.Dispatch<React.SetStateAction<IStation[] | undefined>>;
}

const dataFromStations = await getStationData()

function Barchart(props: IBarchart) {
    const { selectedStations } = props;

    const temperaturesForAllStationsHelper = Object.values(dataFromStations).map((value: IStation) => value.averageTemperature);
    const customInterpolator = d3.scaleSequential(d3.interpolateRgbBasis(["green", "yellow", "red"]));

    const scale = d3.scaleSequential()
        .domain([d3.min(temperaturesForAllStationsHelper), d3.max(temperaturesForAllStationsHelper)])
        .interpolator(customInterpolator);

    const getColor = (stationName: string, temperature: number): string => {
        // Ensure that scale is properly defined in the surrounding scope
        const baseColor = scale(temperature);

        if (selectedStations && selectedStations.length > 0) {
            const isSelected = selectedStations.some(station => {
                const selectedName = `${station.networkNumber}-${station.stationsId}-${station.stationsIdSupplement}`;
                return selectedName === stationName;
            });

            if (isSelected) {
                return baseColor;
            } else {
                const { r, g, b } = d3.color(baseColor).rgb();
                return `rgba(${r},${g},${b},0.25)`;
            }
        } else {
            return baseColor;
        }
    };

    const getBorderColor = (stationName: string): string => {
        // Ensure that scale is properly defined in the surrounding scope
        const baseColor = "black";

        if (selectedStations && selectedStations.length > 0) {
            const isSelected = selectedStations.some(station => {
                const selectedName = `${station.networkNumber}-${station.stationsId}-${station.stationsIdSupplement}`;
                return selectedName === stationName;
            });

            if (isSelected) {
                return baseColor;
            } else {
                const { r, g, b } = d3.color(baseColor).rgb();
                return `rgba(${r},${g},${b},0.25)`;
            }
        } else {
            return baseColor;
        }
    };


    const margin = { top: 20, right: 0, bottom: 70, left: 35 }
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerHeight || 0);
    const height = (35 * vh) / 100 - margin.top - margin.bottom;
    const width = (20 * vw) / 100 - margin.left - margin.right;
    // Parse the Data
    const temperaturesArray = Object.entries(dataFromStations).map(([stationName, data]) => ({
        stationName,
        data
    })) as { stationName: string, data: IStation }[];

    const sortedTemperaturesArray = temperaturesArray.sort((a, b) => b.data.averageTemperature - a.data.averageTemperature);


    const gx = useRef();
    const gy = useRef();
    // X axis
    const x = d3
        .scaleBand()
        .range([0, width])
        .domain(sortedTemperaturesArray.map(d => d.data.name))
        .padding(0.2);

    // Add Y axis
    const y = d3.scaleLinear().domain([0, d3.max(sortedTemperaturesArray, d => d.data.averageTemperature) + 1]).range([height, 0]);


    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        d3.select(gx.current).call(d3.axisBottom(x)).selectAll("text")
            .attr("transform", "rotate(-90)")
            .attr("dy", "-0.5em")
            .attr("dx", "-1em")
            .style("text-anchor", "end");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        d3.select(gy.current).call(d3.axisLeft(y))
    }, [gx, gy, x, y]);


    return (
        <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
            <g transform={`translate(${margin.left},${margin.top})`}>
                {/* x-Achsen-Beschriftung */}
                <g ref={gx as unknown as LegacyRef<SVGGElement> | undefined} transform={`translate(0, ${height})`} />
                <text
                    x={width / 2}
                    y={height + margin.top + 30}
                    textAnchor="middle"
                    fill="black"
                    fontSize="14px"
                >
                    Stations
                </text>

                {/* y-Achsen-Beschriftung */}
                <g ref={gy as unknown as LegacyRef<SVGGElement> | undefined} />
                <text
                    x={-margin.left - 70}
                    y={-margin.top - 5 }
                    textAnchor="middle"
                    transform={`rotate(-90)`}
                    fill="black"
                    fontSize="14px"
                >
                    Temperature in °C
                </text>

                <g fill="white" stroke="currentColor" strokeWidth="1">
                    {sortedTemperaturesArray.map((d, i) => (
                        <rect
                            key={i}
                            x={x(d.data.name)}
                            y={y(d.data.averageTemperature)}
                            width={x.bandwidth()}
                            height={height - y(d.data.averageTemperature)}
                            fill={getColor(d.stationName, d.data.averageTemperature)}
                            color={getBorderColor(d.stationName)}
                            data-station={d.data.name}
                        />
                    ))}
                </g>
            </g>
        </svg>
    );

}

export default Barchart;
