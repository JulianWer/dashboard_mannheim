import {Circle, MapContainer, TileLayer, Tooltip} from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import {LatLngTuple} from "leaflet";
import classes from "./styles/LeafletMap.module.css";
import metadata from "../metadata.json";
import DataHandler from "../utils/DataHandler.tsx"
import * as d3 from 'd3';

const temperaturesForAllStations = await DataHandler()

const temperaturesForAllStationsHelper = Object.values(temperaturesForAllStations).map(value => parseFloat(value as string));

const customInterpolator = d3.scaleSequential(d3.interpolateRgbBasis(["green","yellow","red"]));

const scale = d3.scaleSequential()
    .domain([d3.min(temperaturesForAllStationsHelper), d3.max(temperaturesForAllStationsHelper)])
    .interpolator(customInterpolator);

console.log(temperaturesForAllStations)

function getColor(messnetzNr : string, stationsId : string, stationsIdErgänzung : string) {
    const stationName = `${messnetzNr}-${stationsId}-${stationsIdErgänzung}`;
    const temperatureValue = temperaturesForAllStations[stationName]
    return scale(temperatureValue)
}

export function LeafletMap() {
    const coordinates : LatLngTuple = [49.499061, 8.475401]
    console.log(metadata)

    return (
        <div>
            <MapContainer
                center={coordinates}
                zoom={15}
                className={classes.mapContainer}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <svg>
                    <g fill="white" stroke="currentColor" strokeWidth="0">
                        {metadata.stations && metadata.stations.map((d, i) => (
                            <Circle
                                key={i}
                                center={[d.latitude, d.longitude]}
                                pathOptions={{ color: getColor(d.messnetzNr, d.stationsId, d.stationsIdErgänzung), fillOpacity: 1 }}
                                radius={20}  >
                                <Tooltip>
                                    <div>
                                        Name: {d.name}<br />
                                        Coordinates:<br />
                                        latitude: {d.latitude}<br />
                                        longitude: {d.longitude}
                                    </div>
                                </Tooltip>
                            </Circle>
                        ))
                        }
                    </g>
                </svg>
            </MapContainer>
        </div>
    );

}
