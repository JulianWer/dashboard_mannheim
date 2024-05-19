import * as d3 from "d3";
import {LegacyRef, SetStateAction, useEffect, useRef, useState} from "react";

export default function ScatterplotIris() {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 };
  const width = 460 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv(
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
    )
        .then((irisData) => {
          setData(irisData as unknown as SetStateAction<never[]>);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
  }, []);

  const gx = useRef();
  const gy = useRef();
  const x = d3.scaleLinear().domain([3, 9]).range([0, width]);

  const y = d3.scaleLinear().domain([0, 9]).range([height, 0]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  useEffect(() => void d3.select(gx.current).call(d3.axisBottom(x)), [gx, x]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  useEffect(() => void d3.select(gy.current).call(d3.axisLeft(y)), [gy, y]);
  return (
    <>
      <svg width={width} height={height}>
        <g
          ref={gx as unknown as LegacyRef<SVGGElement> | undefined}
          transform={`translate(0,${height - margin.right})`}
        />
        <g
          ref={gy as unknown as LegacyRef<SVGGElement> | undefined}
          transform={`translate(${margin.left},0)`}
        />
        <g fill="white" stroke="currentColor" strokeWidth="1.5">
          {data.map((d, i) => (
            <circle
              key={i}
              cx={x(d.Sepal_Length)}
              cy={y(d.Petal_Length)}
              r="2.5"
            />
          ))}
        </g>
      </svg>
    </>
  );
}
