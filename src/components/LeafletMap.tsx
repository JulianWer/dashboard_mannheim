import {Circle, MapContainer, TileLayer, Tooltip} from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import {LatLngTuple} from "leaflet";
import classes from "./styles/LeafletMap.module.css";
import metadata from "../metadata.json";
import * as d3 from 'd3';

const maxTemperaturesForAllStationsOnSelectedDay = await getStationDataSelectedDay()
const minTemperaturesForAllStationsOnNextDay = await getStationDataNextDay()
const tempDifferencesForAllStations = getTempDifferences()

const tempDifferencesForAllStationsHelper = Object.values(tempDifferencesForAllStations).map(value => parseFloat(value as string));

const customInterpolator = d3.interpolateRgb("#7dbefa", "#08306b");

//const scale = d3.scaleSequential([d3.min(tempDifferencesForAllStationsHelper),d3.max(tempDifferencesForAllStationsHelper)],d3.interpolateBlues);

const scale = d3.scaleSequential()
    .domain([d3.min(tempDifferencesForAllStationsHelper), d3.max(tempDifferencesForAllStationsHelper)])
    .interpolator(customInterpolator);


console.log(tempDifferencesForAllStations)

function getTempDifferences() {
    if (maxTemperaturesForAllStationsOnSelectedDay && minTemperaturesForAllStationsOnNextDay) {
        // Variable für die Differenzen der Temperaturwerte je Messstation
        const temperatureDifferences = {};
    
        // Iteration durch jede Station
        Object.keys(maxTemperaturesForAllStationsOnSelectedDay).forEach(station => {
            // Überprüfen, ob die Station in beiden Datensätzen vorhanden ist
            if (Object.prototype.hasOwnProperty.call(minTemperaturesForAllStationsOnNextDay, station)) {
                // Berechnen der Differenz der Temperaturwerte für die Station
                const maxTemperature = maxTemperaturesForAllStationsOnSelectedDay[station];
                const minTemperature = minTemperaturesForAllStationsOnNextDay[station];
                const temperatureDifference = maxTemperature - minTemperature;
    
                // Speichern der Differenz für die Station
                temperatureDifferences[station] = temperatureDifference;
            }
        });
    
        // temperatureDifferences enthält jetzt die Differenz der Temperaturwerte für jede Messstation
        return temperatureDifferences;
    }
}
function getStationDataSelectedDay() {
    return d3.csv("/public/data.csv").then(function(data) {
        // Filtern der Daten nach dem gewünschten Tag
        const filteredData = data.filter(d => {
        // Überprüfung, ob der Zeitstempel das erwartete Format hat (YYYY-MM-DDTHH:MM:SSZ)
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(d.timestamps)) {
            // Parsen des Zeitstempels
            const timestamp = new Date(d.timestamps);
            // Vergleich des Datums mit dem gewünschten Tag
            return timestamp.toISOString().slice(0, 10) === "2024-04-06";
        }
    });
    
    // Gruppieren der Daten nach Messstationen
    const stationData = {};
    filteredData.forEach(d => {
        const stationName = `${d.Messnetz}-${d.StationsID}-${d.StationsIDErgänzung}`;
        if (!stationData[stationName]) {
            stationData[stationName] = [];
        }
        stationData[stationName].push(parseFloat(d.temperature)); // Annahme: Die Temperaturwerte sind im Feld "temperature"
    });

    console.log(stationData)
    
    // Bestimmen des maximalen Temperaturwerts für jede Messstation
    const maxTemperatures = {};
    Object.keys(stationData).forEach(station => {
        maxTemperatures[station] = Math.max(...stationData[station]);
    });
    
    return maxTemperatures;
    
    });

}


function getStationDataNextDay() {
    return d3.csv("/public/data.csv").then(function(data) {
        // Filtern der Daten nach dem gewünschten Tag
        const filteredData = data.filter(d => {
        // Überprüfung, ob der Zeitstempel das erwartete Format hat (YYYY-MM-DDTHH:MM:SSZ)
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(d.timestamps)) {
            // Parsen des Zeitstempels
            const timestamp = new Date(d.timestamps);
            const desiredDate = "2024-04-07";
            const desiredNoon = new Date(desiredDate + "T12:00:00Z");
            // Überprüfung, ob der Zeitstempel vor oder genau um 12 Uhr ist
            return timestamp.toISOString().slice(0, 10) === desiredDate && timestamp.getTime() <= desiredNoon.getTime();
        }
    });
    
    // Gruppieren der Daten nach Messstationen
    const stationData = {};
    filteredData.forEach(d => {
        const stationName = `${d.Messnetz}-${d.StationsID}-${d.StationsIDErgänzung}`;
        if (!stationData[stationName]) {
            stationData[stationName] = [];
        }
        stationData[stationName].push(parseFloat(d.temperature)); // Annahme: Die Temperaturwerte sind im Feld "temperature"
    });

    console.log(stationData)
    
    // Bestimmen des minimalen Temperaturwerts für jede Messstation
    const minTemperatures = {};
    Object.keys(stationData).forEach(station => {
        minTemperatures[station] = Math.min(...stationData[station].filter(temperature => temperature !== -999));
    });
    
    return minTemperatures;
    
    });

}

function getColor(messnetzNr : string, stationsId : string, stationsIdErgänzung : string) {
    const stationName = `${messnetzNr}-${stationsId}-${stationsIdErgänzung}`;
    const temperatureValue = tempDifferencesForAllStations[stationName]
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
