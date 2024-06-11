import {getDataForOneStation} from "../utils/DataHandler.tsx";
import {useEffect, useRef} from "react";
import * as d3 from "d3";

type TimeTemp = {
    timestamp: Date,
    temperature: number
};

const data: TimeTemp[] = await getDataForOneStation("015", "2024-04-07");
const temperatures: number[] = data.map((tt: TimeTemp) => tt.temperature);

export default function LineChart() {
    const margin = {top: 10, right: 30, bottom: 30, left: 60};
    const width: number = 460 - margin.left - margin.right;
    const height: number = 400 - margin.top - margin.bottom;

    const ref = useRef<SVGSVGElement>();

    useEffect(() => {
        const svg = d3
            .select(ref.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xTimeScale = d3
            .scaleTime()
            .domain([new Date("2024-04-07T00:00:000Z"), new Date("2024-04-07T23:59:000Z")])
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain(d3.extent(temperatures))
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xTimeScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line<TimeTemp>()
                .x((d: TimeTemp) => xTimeScale(d.timestamp))
                .y((d: TimeTemp) => yScale(d.temperature))
            );
    })

    return <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} ref={ref}/>;
}