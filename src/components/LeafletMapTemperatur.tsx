import {Circle, MapContainer, TileLayer, Tooltip} from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import {LatLngTuple} from "leaflet";
import classes from "./styles/LeafletMap.module.css";
import metadata from "../metadata.json";
import * as d3 from 'd3';

const minTemperaturesForAllStations = await getStationData()

const minTemperaturesForAllStationsHelper = Object.values(minTemperaturesForAllStations).map(value => parseFloat(value as string));

const customInterpolator = d3.scaleSequential(d3.interpolateRgbBasis(["green","yellow","red"]));

const scale = d3.scaleSequential()
    .domain([d3.min(minTemperaturesForAllStationsHelper), d3.max(minTemperaturesForAllStationsHelper)])
    .interpolator(customInterpolator);


console.log(minTemperaturesForAllStations)



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

function getColor(messnetzNr : string, stationsId : string, stationsIdErgänzung : string) {
    const stationName = `${messnetzNr}-${stationsId}-${stationsIdErgänzung}`;
    const temperatureValue = minTemperaturesForAllStations[stationName]
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
