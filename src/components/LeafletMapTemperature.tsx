import {Circle, MapContainer, TileLayer, Tooltip} from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import {LatLngTuple} from "leaflet";
import classes from "./styles/LeafletMapTemperature.module.css";
import {getStationData} from "../utils/DataHandler.ts";
import * as d3 from 'd3';
import {IStation, StationData} from "./Dashboard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useCallback, useEffect, useState} from "react";


interface ILeafletMapTemperature {
    selectedStations: IStation[];
    date: string;
    setSelectedStations: React.Dispatch<React.SetStateAction<IStation[] | undefined>>;
    isInGuidedMode: boolean;
    setIsInGuidedMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeafletMapTemperature(props: ILeafletMapTemperature) {

    const {selectedStations, setSelectedStations, isInGuidedMode, date} = props;

    const coordinates: LatLngTuple = [49.499061 - 0.0007, 8.475401 + 0.011];


    const [temperaturesForAllStations, setTemperaturesForAllStations] = useState<StationData>({});


    const fetchData = useCallback(async () => {
        const data: StationData = await getStationData(date, "06:30", 1);
        setTemperaturesForAllStations(data);
    }, [date]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const temperaturesForAllStationsHelper = Object.values(temperaturesForAllStations).map(value => parseFloat(String((value as IStation).averageTemperature)));

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
            } else {
                setSelectedStations([station]);
            }
        }
    };

    return (
        <div className="relative w-full">
            {selectedStations.length !== 0 && !isInGuidedMode && (
                <Button
                    onClick={() => {
                        setSelectedStations([])
                    }}
                    className={`bg-red-500 text-white hover:bg-red-600 focus:outline-none`}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        zIndex: 1000, // Ensure the button appears above the map
                        padding: "10px",
                        border: "1px solid #ccc",
                        cursor: "pointer"
                    }}
                >
                    Reset selection
                </Button>)}
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
                                radius={25}
                                eventHandlers={{
                                    click: (e) => {
                                        !isInGuidedMode ? handleCircleClick(d.data, e.originalEvent) : null;
                                    }

                                }}
                            >
                                <Tooltip>
                                    <div>
                                        Name: {d.data.name}<br/>
                                        Temperatur: {d.data.averageTemperature.toFixed(2)}°C
                                    </div>
                                </Tooltip>
                            </Circle>
                        ))}
                    </g>
                </svg>
            </MapContainer>

            <div className={classes.blurGradient}></div>

        </div>

    );
}
