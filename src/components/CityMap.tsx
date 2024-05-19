// src/CityMap.js
import { useEffect, useState } from "react";
import * as d3 from "d3";
import { geoPath } from "d3";
import { FeatureCollection } from "geojson";
import osmtogeojson from "osmtogeojson";



const CityMap = () => {
  const width = 960;
  const height = 1000;
    const [data, setData] = useState<FeatureCollection | null>(null);

  const projection1 = d3
    .geoMercator()
    .scale(200000)
    .center([8.466, 49.4875]) // Center on Mannheim
    .translate([width / 2, height / 2]);



  useEffect(() => {

      d3.json(
          "https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area(id:3600062691)->.searchArea;(way[\"highway\"](area.searchArea););out body;>;out skel qt;"
      )
          .then((data) => {
              const geoJsonData = osmtogeojson(data) as FeatureCollection;
              setData(geoJsonData);
          })
          .catch((error) => {
              console.error("Error fetching Mannheim data:", error);
          });

  }, []);


  return (
    <svg height={height} width={width}>
      {data !== null && (
        <g className="map">
          {data.features.map((d, i) => (
            <path
              key={`path-${i}`}
              d={geoPath().projection(projection1)(d) as string | undefined}
              className="country"
              stroke="#FFFFFF"
              strokeWidth={0.5}
            />
          ))}
        </g>
      )}
    </svg>
  );


};

export default CityMap;
