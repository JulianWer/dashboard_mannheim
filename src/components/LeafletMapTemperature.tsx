import { Circle, MapContainer, TileLayer, Tooltip } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import classes from "./styles/LeafletMap.module.css";
import { getStationData } from "../utils/DataHandler.ts";
import * as d3 from 'd3';
import { IStation } from "./Dashboard.tsx";

const temperaturesForAllStations = await getStationData();

interface ILeafletMapTemperature {
    selectedStations: IStation[];
    setSelectedStations: React.Dispatch<React.SetStateAction<IStation[] | undefined>>;
}

export default function LeafletMapTemperature(props: ILeafletMapTemperature) {

    const { selectedStations } = props;

    const coordinates: LatLngTuple = [49.499061, 8.475401];

    const temperaturesForAllStationsHelper = Object.values(temperaturesForAllStations as IStation).map(value => parseFloat(value.averageTemperature));

    const customInterpolator = d3.scaleSequential(d3.interpolateRgbBasis(["green", "yellow", "red"]));

    const scale = d3.scaleSequential()
        .domain([d3.min(temperaturesForAllStationsHelper), d3.max(temperaturesForAllStationsHelper)])
        .interpolator(customInterpolator);

    // Parse the Data
    const temperaturesArray = Object.entries(temperaturesForAllStations).map(([stationName, data]) => ({
        stationName,
        data
    })) as { stationName: string, data: IStation }[];

    function getColor(networkNumber: string, stationsId: string, stationsIdSupplement: string) {
        const stationName = `${networkNumber}-${stationsId}-${stationsIdSupplement}`;
        const temperatureValue = temperaturesForAllStations[stationName];
        const baseColor = scale(temperatureValue.averageTemperature);

        const isSelected = selectedStations.some(station =>
            station.networkNumber === networkNumber &&
            station.stationsId === stationsId &&
            station.stationsIdSupplement === stationsIdSupplement
        );

        if (isSelected) {
            return baseColor;
        } else {
            const { r, g, b } = d3.color(baseColor).rgb();
            return `rgba(${r},${g},${b},0.3)`;
        }
    }
    function getBorderColor(networkNumber: string, stationsId: string, stationsIdSupplement: string) {
        const baseColor = "black"

        const isSelected = selectedStations.some(station =>
            station.networkNumber === networkNumber &&
            station.stationsId === stationsId &&
            station.stationsIdSupplement === stationsIdSupplement
        );

        if (isSelected) {
            return baseColor;
        } else {
            const { r, g, b } = d3.color(baseColor).rgb();
            return `rgba(${r},${g},${b},0.3)`;
        }
    }

    return (
        <div style={{ height: "90vh", width: "100vh", display: "flex", justifyContent: "flex-start" }}>
            <MapContainer
                center={coordinates}
                zoom={15}
                className={classes.mapContainer}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <svg>
                    <g fill="white" stroke="currentColor" strokeWidth="0">
                        {temperaturesArray.map((d, i) => (
                            <Circle
                                key={i}
                                center={[d.data.latitude, d.data.longitude]}
                                pathOptions={{
                                    color: getBorderColor(d.data.networkNumber, d.data.stationsId, d.data.stationsIdSupplement),
                                    fillColor: getColor(d.data.networkNumber, d.data.stationsId, d.data.stationsIdSupplement),
                                    fillOpacity: 1,
                                    weight: 0.8
                                    
                                }}
                                radius={20}
                                eventHandlers={{
                                }}
                            >
                                <Tooltip>
                                    <div>
                                        Name: {d.data.name}<br />
                                        Coordinates:<br />
                                        latitude: {d.data.latitude}<br />
                                        longitude: {d.data.longitude}
                                    </div>
                                </Tooltip>
                            </Circle>
                        ))}
                    </g>
                </svg>
            </MapContainer>
        </div>
    );
}
