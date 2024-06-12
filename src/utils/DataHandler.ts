import * as d3 from "d3";
import {IStation} from "../components/Dashboard.tsx";
import metadata from "../metadata.json";


export function getStationData() {
    return d3.csv("/public/data.csv").then((data) => {
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


        const metadataLookup = {};
        metadata.stations.forEach(station => {
            const stationName = `${station.networkNumber}-${station.stationsId}-${station.stationsIdSupplement}`;
            metadataLookup[stationName] = {
                latitude: station.latitude,
                longitude: station.longitude,
                name: station.name
            };
        });

        // group data by station
        const stationData = {};
        filteredData.forEach((d) => {
            const stationName = `${d.Messnetz}-${d.StationsID}-${d.StationsIDErgänzung}`;
            if (!stationData[stationName]) {
                stationData[stationName] = {
                    latitude: parseFloat(metadataLookup[stationName].latitude),
                    longitude: parseFloat(metadataLookup[stationName].longitude),
                    networkNumber: d.Messnetz,
                    name: metadataLookup[stationName].name,
                    stationsId: d.StationsID,
                    stationsIdSupplement: d.StationsIDErgänzung,
                    temperatures: [],
                    averageTemperature: 0
                } as IStation
            }
            stationData[stationName].temperatures.push(parseFloat(d.temperature));
            stationData[stationName].averageTemperature = getAverageTemperature(stationData[stationName].temperatures);
        });


        // get average temperature of a station from 3:30 to 4:30
        function getAverageTemperature(stationTemperaures: number[]) {
            const validTemperatures = stationTemperaures.filter(temperature => temperature !== -999);
            const sumTemperatures = validTemperatures.reduce((sum, temperature) => sum + temperature, 0);
            return sumTemperatures / validTemperatures.length;
        }

        return stationData;
    });
}
