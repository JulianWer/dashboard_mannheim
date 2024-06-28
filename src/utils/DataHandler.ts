import * as d3 from "d3";
import moment, {Moment} from "moment-timezone";
import {IStation, StationData} from "../components/Dashboard.tsx";
import metadata from "../metadata.json";

let cachedCsvData: any[] | null = null;
const metadataLookup = initializeMetadataLookup();

async function fetchCsvData(): Promise<any[]> {
    if (cachedCsvData === null) {
        const rawData = await d3.csv("/data.csv");
        // Preprocess the timestamps once
        cachedCsvData = rawData.map(d => ({
            ...d,
            timestamp: moment.tz(d.timestamps, "Europe/Berlin")
        }));
    }
    return cachedCsvData;
}

function initializeMetadataLookup() {
    return metadata.stations.reduce((acc, station) => {
        const stationName = `${station.networkNumber}-${station.stationsId}-${station.stationsIdSupplement}`;
        acc[stationName] = {
            latitude: station.latitude,
            longitude: station.longitude,
            name: station.name
        };
        return acc;
    }, {});
}

function filterDataByDate(cachedData: any[], desiredDate: string, desiredEndTime: string = "12:00:00", hoursStartToEndTime: number = 24): any[] {
    const desiredEnd: Moment = moment.tz(desiredDate + " " + desiredEndTime, "Europe/Berlin");
    const desiredBeginning: Moment = moment(desiredEnd).subtract(hoursStartToEndTime, "hours");

    return cachedData.filter(d => d.timestamp.isBetween(desiredBeginning, desiredEnd, undefined, "[]"));
}

function optimizeStationData(filteredData: any[]): StationData {

    const stationData: StationData = filteredData.reduce((acc, d) => {
        const stationName = `${d.Messnetz}-${d.StationsID}-${d.StationsIDErgänzung}`;

        if (!(stationName in acc)) {
            acc[stationName] = getStationDefaultData(d, metadataLookup, stationName);
        }

        const temperature = parseFloat(d.temperature);
        acc[stationName].temperatures.push(temperature);
        acc[stationName].temperaturesWithTimestamp.push({timestamp: d.timestamp.toDate(), temperature});

        return acc;
    }, {} as StationData);

    // Compute averageTemperature after accumulating all temperatures
    Object.values(stationData).forEach(station => {
        station.averageTemperature = getAverageTemperature(station.temperatures);
    });

    return stationData;
}

export async function getStationData(desiredDate: string, desiredEndTime: string = "12:00:00", hoursStartToEndTime: number = 24): Promise<{
    data: StationData,
    timeFilteredData: StationData
}> {
    const cachedData = await fetchCsvData();
    const filteredData = filterDataByDate(cachedData, desiredDate, desiredEndTime, hoursStartToEndTime);
    const filteredDataDefault = filterDataByDate(cachedData, desiredDate, "12:00:00", 24);

    const stationData = optimizeStationData(filteredDataDefault);
    const stationDataWithTime = optimizeStationData(filteredData);


    return {data: stationData, timeFilteredData: stationDataWithTime};
}

function getAverageTemperature(temperatures: number[]): number {
    const validTemperatures = temperatures.filter(temp => temp !== -999);
    const sumTemperatures = validTemperatures.reduce((sum, temp) => sum + temp, 0);
    return validTemperatures.length ? sumTemperatures / validTemperatures.length : 0;
}

function getStationDefaultData(data, metadataLookup, stationName): IStation {
    const metadata = metadataLookup[stationName];
    return {
        latitude: metadata.latitude,
        longitude: metadata.longitude,
        networkNumber: data.Messnetz,
        name: metadata.name,
        stationsId: data.StationsID,
        stationsIdSupplement: data.StationsIDErgänzung,
        temperatures: [],
        averageTemperature: 0,
        temperaturesWithTimestamp: []
    } as IStation;
}

