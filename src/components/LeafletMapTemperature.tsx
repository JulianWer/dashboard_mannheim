import {Circle, MapContainer, TileLayer, Tooltip} from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import {LatLngTuple} from "leaflet";
import classes from "./styles/LeafletMapTemperature.module.css";
import {getStationData} from "../utils/DataHandler.ts";
import * as d3 from 'd3';
import {IStation} from "./Dashboard.tsx";

const temperaturesForAllStations = await getStationData();

interface ILeafletMapTemperature {
    selectedStations: IStation[];
    setSelectedStations: React.Dispatch<React.SetStateAction<IStation[] | undefined>>;
    isInGuidedMode: boolean;
}

export default function LeafletMapTemperature(props: ILeafletMapTemperature) {

    const {selectedStations, setSelectedStations, isInGuidedMode} = props;

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

    function getColor(networkNumber: string, stationsId: string, stationsIdSupplement: string, isBorder?: boolean) {
        const stationName = `${networkNumber}-${stationsId}-${stationsIdSupplement}`;
        const temperatureValue = temperaturesForAllStations[stationName];
        const baseColor = isBorder ? "black" : scale(temperatureValue.averageTemperature);

        const isSelected = selectedStations.some(station =>
            station.networkNumber === networkNumber &&
            station.stationsId === stationsId &&
            station.stationsIdSupplement === stationsIdSupplement
        );
        if (selectedStations.length === 0) {
            return baseColor
        } else {
            if (isSelected) {
                return baseColor;
            } else {
                const {r, g, b} = d3.color(baseColor).rgb();
                return `rgba(${r},${g},${b},0.3)`;
            }
        }
    }


    const handleCircleClick = (station: IStation, event: MouseEvent) => {
        const isAlreadySelected = selectedStations.some(selectedStation =>
            station.networkNumber === selectedStation.networkNumber &&
            station.stationsId === selectedStation.stationsId &&
            station.stationsIdSupplement === selectedStation.stationsIdSupplement
        );
        if (selectedStations.length === 0) {
            setSelectedStations([station]);
        } else {

            if (event.metaKey || event.ctrlKey) {
                if (isAlreadySelected) {
                    setSelectedStations(selectedStations.filter(selectedStation =>
                        !(selectedStation.networkNumber === station.networkNumber &&
                            selectedStation.stationsId === station.stationsId &&
                            selectedStation.stationsIdSupplement === station.stationsIdSupplement)
                    ));
                } else {
                    setSelectedStations((prev) => [...prev, station]);
                }
            }
        }
    };

    return (
        <div style={{height: "90vh", width: "100vh", position: "relative"}}>
            {selectedStations.length !== 0 && !isInGuidedMode && (
                <button
                    onClick={() => {
                        setSelectedStations([])
                    }}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        zIndex: 1000, // Ensure the button appears above the map
                        padding: "10px",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Reset selection
                </button>)}
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
                                className={classes.circleButton}
                                key={i}
                                center={[d.data.latitude, d.data.longitude]}
                                pathOptions={{
                                    color: getColor(d.data.networkNumber, d.data.stationsId, d.data.stationsIdSupplement, true),
                                    fillColor: getColor(d.data.networkNumber, d.data.stationsId, d.data.stationsIdSupplement),
                                    fillOpacity: 1,
                                    weight: 0.8

                                }}
                                radius={20}
                                eventHandlers={{
                                    click: (e) => {
                                        !isInGuidedMode ? handleCircleClick(d.data, e.originalEvent) : null;
                                    }

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
                        ))}
                    </g>
                </svg>
            </MapContainer>
        </div>
    );
}
