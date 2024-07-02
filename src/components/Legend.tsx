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
        const margin = { top: 1.3, right: 0, bottom: 5, left: 2 }
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerHeight || 0);
        const legendHeight = (2.4 * vh) / 100 ;
        const legendWidth = (22 * vw) / 100 ;
    

        d3.select(legendRef.current).selectAll("svg").remove();

        const svg = d3.select(legendRef.current)
            .append('svg')
            .attr('width', legendWidth + margin.left + margin.right)
            .attr('height', legendHeight + (1 * vh) / 100)
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
            .attr('height', legendHeight - (1.3 * vh) / 100)
            .style('fill', 'url(#linear-gradient)');


        const xScale = d3.scaleLinear()
            .domain([minDomain, maxDomain])
            .range([0, legendWidth]);

        const xAxis = d3.axisBottom(xScale)
            .ticks(5);

        svg.append('g')
            .attr('transform', `translate(0, ${legendHeight - (1.3 * vh) / 100})`)
            .style("font-size", "1.2vh")
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
                .attr('y2', legendHeight - (1.3 * vh) / 100)
                .attr('stroke', lineColor)
                .attr('stroke-width', 3);

            svg.append('line')
                .attr('x1', maxTempPos)
                .attr('x2', maxTempPos)
                .attr('y1', 0)
                .attr('y2', legendHeight - (1.3 * vh) / 100)
                .attr('stroke', lineColor)
                .attr('stroke-width', 3);
        }

    }, [scale, minTemperature, maxTemperature]);

    return <div style={{height: "30"}} ref={legendRef}></div>;
};

export default Legend;