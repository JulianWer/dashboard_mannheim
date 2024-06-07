import * as d3 from "d3";
import { useEffect, useRef } from "react";

const temperaturesForAllStations = await getStationData()

const temperaturesForAllStationsHelper = Object.values(temperaturesForAllStations).map(value => parseFloat(value as string));

const customInterpolator = d3.scaleSequential(d3.interpolateRgbBasis(["green","yellow","red"]));

const scale = d3.scaleSequential()
    .domain([d3.min(temperaturesForAllStationsHelper), d3.max(temperaturesForAllStationsHelper)])
    .interpolator(customInterpolator);


function getStationData() {
  return d3.csv("/public/data.csv").then(function(data) {
      // Filtern der Daten nach dem gewünschten Tag
      const filteredData = data.filter(d => {
      // Überprüfung, ob der Zeitstempel das erwartete Format hat (YYYY-MM-DDTHH:MM:SSZ)
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(d.timestamps)) {
          // Parsen des Zeitstempels
          const timestamp = new Date(d.timestamps);
          const desiredDate = "2024-04-07";
          const desiredBeginning = new Date(desiredDate + "T03:30:00Z");
          const desiredEnd = new Date(desiredDate + "T04:30:00Z");
          return timestamp.toISOString().slice(0, 10) === desiredDate && timestamp.getTime() >= desiredBeginning.getTime() && timestamp.getTime() <= desiredEnd.getTime();
      }
  });
  
  // Gruppieren der Daten nach Messstationen
  const stationData = {};
  filteredData.forEach(d => {
      const stationName = `${d.Messnetz}-${d.StationsID}-${d.StationsIDErgänzung}`;
      if (!stationData[stationName]) {
          stationData[stationName] = [];
      }
      stationData[stationName].push(parseFloat(d.temperature)); 
  });
  
  // Bestimmen der durchschnittlichen Temperatur jeder Station von 3:30 bis 4:30
  const averageTemperatures = {};
  Object.keys(stationData).forEach(station => {
      const validTemperatures = stationData[station].filter(temperature => temperature !== -999);
      const sumTemperatures = validTemperatures.reduce((sum, temperature) => sum + temperature, 0);
      const averageTemperature = sumTemperatures / validTemperatures.length;
  averageTemperatures[station] = averageTemperature;
  });
  
  return averageTemperatures;
  
  });

}

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