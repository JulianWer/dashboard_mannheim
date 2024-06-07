import * as d3 from "d3";
import { useEffect, useRef } from "react";
import DataHandler from "../utils/DataHandler.tsx"

const temperaturesForAllStations = await DataHandler()

const temperaturesForAllStationsHelper = Object.values(temperaturesForAllStations).map(value => parseFloat(value as string));

const customInterpolator = d3.scaleSequential(d3.interpolateRgbBasis(["green","yellow","red"]));

const scale = d3.scaleSequential()
    .domain([d3.min(temperaturesForAllStationsHelper), d3.max(temperaturesForAllStationsHelper)])
    .interpolator(customInterpolator);

const Barchart = () => {
  const ref = useRef();

  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    const temperaturesArray = Object.entries(temperaturesForAllStations).map(([stationName, temperature]) => ({
      stationName,
      temperature: Number(temperature)
    }));

    const sortedTemperaturesArray = temperaturesArray.sort((a, b) => b.temperature - a.temperature);    

    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(sortedTemperaturesArray.map(d => d.stationName))
      .padding(0.2);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear().domain([0, d3.max(sortedTemperaturesArray, d => d.temperature) + 1]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("mybar")
      .data(sortedTemperaturesArray)
      .join("rect")
      .attr("x", (d) => x(d.stationName))
      .attr("y", (d) => y(d.temperature))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.temperature))
      .attr("fill", d => scale(d.temperature));
  });
  return <svg width={460} height={400} id="barchart" ref={ref} />;
};

export default Barchart;