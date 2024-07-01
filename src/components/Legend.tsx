import {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {IStation, StationData} from "@/components/Dashboard.tsx";


interface ILegend {
    dataFromStations: StationData;
    minTemperature: number;
    maxTemperature: number;
}

const Legend = (props: ILegend) => {
    const {dataFromStations, minTemperature, maxTemperature} = props;
    const legendRef = useRef(null);

    const temperaturesForAllStationsHelper = Object.values(dataFromStations).map((value: IStation) => value.averageTemperature);
    const customInterpolator = d3.scaleSequential(d3.interpolateRgbBasis(["green", "yellow", "red"]));

    const scale = d3.scaleSequential()
        .domain([d3.min(temperaturesForAllStationsHelper), d3.max(temperaturesForAllStationsHelper)])
        .interpolator(customInterpolator);
    useEffect(() => {
        const legendWidth = 400;
        const legendHeight = 30;
        const margin = {top: 10, right: 20, bottom: 30, left: 20};

        d3.select(legendRef.current).selectAll("svg").remove();

        const svg = d3.select(legendRef.current)
            .append('svg')
            .attr('width', legendWidth + margin.left + margin.right)
            .attr('height', 40)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const defs = svg.append('defs');
        const linearGradient = defs.append('linearGradient')
            .attr('id', 'linear-gradient');

        const minDomain = scale.domain()[0];
        const maxDomain = scale.domain()[1];
        const range = d3.range(0, 1.1, 0.1);

        linearGradient.selectAll('stop')
            .data(range)
            .enter().append('stop')
            .attr('offset', d => `${d * 100}%`)
            .attr('stop-color', d => scale(minDomain + d * (maxDomain - minDomain)));

        svg.append('rect')
            .attr('width', legendWidth)
            .attr('height', legendHeight - 20)
            .style('fill', 'url(#linear-gradient)');

        const xScale = d3.scaleLinear()
            .domain([minDomain, maxDomain])
            .range([0, legendWidth]);

        const xAxis = d3.axisBottom(xScale)
            .ticks(5);

        svg.append('g')
            .attr('transform', `translate(0, ${legendHeight - 20})`)
            .call(xAxis);

        if (minTemperature && maxTemperature) {
            // Add lines for min and max temperatures
            const lineColor = 'black';
            const minTempPos = xScale(minTemperature);
            const maxTempPos = xScale(maxTemperature);

            svg.append('line')
                .attr('x1', minTempPos)
                .attr('x2', minTempPos)
                .attr('y1', 0)
                .attr('y2', legendHeight - 20)
                .attr('stroke', lineColor)
                .attr('stroke-width', 3);

            svg.append('line')
                .attr('x1', maxTempPos)
                .attr('x2', maxTempPos)
                .attr('y1', 0)
                .attr('y2', legendHeight - 20)
                .attr('stroke', lineColor)
                .attr('stroke-width', 3);
        }

    }, [scale, minTemperature, maxTemperature]);

    return <div style={{height: "30"}} ref={legendRef}></div>;
};

export default Legend;
