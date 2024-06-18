import {Circle, MapContainer, TileLayer, Tooltip} from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import {LatLngTuple} from "leaflet";
import classes from "./styles/LeafletMap.module.css";
import {getStationData} from "../utils/DataHandler.ts"
import * as d3 from 'd3';
import {IStation} from "./Dashboard.tsx";

const temperaturesForAllStations = await getStationData("2024-04-07", "04:30", 1)


interface ILeafletMapTemperatur {
    selectedStation: IStation | undefined;
    setSelectedStation: React.Dispatch<React.SetStateAction<IStation | undefined>>;
}

export default function LeafletMapTemperature(props: ILeafletMapTemperatur) {

    const {selectedStation, setSelectedStation} = props;

    const coordinates: LatLngTuple = [49.499061, 8.475401]

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
        const temperatureValue = temperaturesForAllStations[stationName]
        const baseColor = scale(temperatureValue.averageTemperature)

        if (selectedStation) {
            const {networkNumber, stationsId, stationsIdSupplement} = selectedStation;
            const selectedName = `${networkNumber}-${stationsId}-${stationsIdSupplement}`;

            if (selectedName === stationName) {
                return baseColor;
            } else {
                const {r, g, b} = d3.color(baseColor).rgb();
                return `rgba(${r},${g},${b},0.4)`;
            }
        } else {
            return baseColor;
        }
    }


    const handleCircleClick = (station: IStation) => {
        setSelectedStation(station)
    };

    return (
        <div style={{height: "90vh", width: "100vh", display: "flex", justifyContent: "flex-start"}}>
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
                                    color: getColor(d.data.networkNumber, d.data.stationsId, d.data.stationsIdSupplement),
                                    fillOpacity: 1
                                }}
                                radius={20}
                                eventHandlers={{
                                    click: () => handleCircleClick(d.data),
                                }}
                            >
                                <Tooltip>
                                    <div>
                                        Name: {d.data.name}<br/>
                                        Coordinates:<br/>
                                        latitude: {d.data.latitude}<br/>
                                        longitude: {d.data.longitude}
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
