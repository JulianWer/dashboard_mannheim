import * as d3 from "d3";
import moment, {Moment} from "moment-timezone";
import {IStation} from "../components/Dashboard.tsx";
import metadata from "../metadata.json";
import {StationData} from "../components/Dashboard.tsx";

export function getStationData(desiredDate: string, desiredEndTime: string = "12:00:00", hoursUntilEnd: number = 24): Promise<StationData> {
    const desiredEnd: Moment = moment.tz(desiredDate + " " + desiredEndTime, "Europe/Berlin");
    const desiredBeginning: Moment = moment(desiredEnd).subtract(hoursUntilEnd, "hours");
    return d3.csv("/data.csv").then((data) => {
        // Filter data if in desired timeframe
        const filteredData = data.filter(d => {
            // Check that timestamp from data has correct format (YYYY-MM-DDTHH:MM:SSZ)
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(d.timestamps)) {
                const timestamp: Moment = moment.tz(d.timestamps, "Europe/Berlin");

                // Third parameter is granularity set to undefined checks the whole timestamp, Fourth parameter set to [] return true if timestamp is start or end date
                return timestamp.isBetween(desiredBeginning, desiredEnd, undefined, "[]");
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
        const stationData: StationData = {};
        filteredData.forEach((d) => {
            const stationName: string = `${d.Messnetz}-${d.StationsID}-${d.StationsIDErgänzung}`;
            if (!stationData[stationName]) {
                stationData[stationName] = getStationDefaultData(d, metadataLookup, stationName);
            }
            stationData[stationName].temperatures.push(parseFloat(d.temperature));
            stationData[stationName].averageTemperature = getAverageTemperature(stationData[stationName].temperatures);
            stationData[stationName].temperaturesWithTimestamp.push({
                timestamp: moment.tz(d.timestamps, "Europe/Berlin").toDate(),
                temperature: parseFloat(d.temperature as string)
            });
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

function getStationDefaultData(data, metadataLookup, stationName): IStation {
    return {
        latitude: parseFloat(metadataLookup[stationName].latitude),
        longitude: parseFloat(metadataLookup[stationName].longitude),
        networkNumber: data.Messnetz,
        name: metadataLookup[stationName].name,
        stationsId: data.StationsID,
        stationsIdSupplement: data.StationsIDErgänzung,
        temperatures: [],
        averageTemperature: 0,
        temperaturesWithTimestamp: []
    } as IStation;
}
