import * as d3 from "d3";
import moment, {Moment} from "moment-timezone";
import {IStation, StationData} from "../components/Dashboard.tsx";
import metadata from "../metadata.json";


let cachedCsvData: any[] | null = null;

async function fetchCsvData(): Promise<any[]> {
    if (!cachedCsvData) {
        cachedCsvData = await d3.csv("/data.csv");
    }
    return cachedCsvData;
}

function filterDataByDate(cachedData: any[], desiredDate: string, desiredEndTime: string = "12:00:00", hoursStartToEndTime: number = 24): any[] {
    const desiredEnd: Moment = moment.tz(desiredDate + " " + desiredEndTime, "Europe/Berlin");
    const desiredBeginning: Moment = moment(desiredEnd).subtract(hoursStartToEndTime, "hours");

    return cachedData.filter(d => {
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(d.timestamps)) {
            const timestamp: Moment = moment.tz(d.timestamps, "Europe/Berlin");
            return timestamp.isBetween(desiredBeginning, desiredEnd, undefined, "[]");
        }
        return false;
    });
}

export async function getStationData(desiredDate: string, desiredEndTime: string = "12:00:00", hoursStartToEndTime: number = 24): Promise<StationData> {
    const cachedData = await fetchCsvData();
    const filteredData = filterDataByDate(cachedData, desiredDate, desiredEndTime, hoursStartToEndTime);

    const metadataLookup = metadata.stations.reduce((acc, station) => {
        const stationName = `${station.networkNumber}-${station.stationsId}-${station.stationsIdSupplement}`;
        acc[stationName] = {
            latitude: station.latitude,
            longitude: station.longitude,
            name: station.name
        };
        return acc;
    }, {});

    const stationData: StationData = {};
    for (const d of filteredData) {
        const stationName: string = `${d.Messnetz}-${d.StationsID}-${d.StationsIDErgänzung}`;
        if (!stationData[stationName]) {
            stationData[stationName] = getStationDefaultData(d, metadataLookup, stationName);
        }
        const temperature = parseFloat(d.temperature as string);
        stationData[stationName].temperatures.push(temperature);
        stationData[stationName].averageTemperature = getAverageTemperature(stationData[stationName].temperatures);
        stationData[stationName].temperaturesWithTimestamp.push({
            timestamp: moment.tz(d.timestamps, "Europe/Berlin").toDate(),
            temperature
        });
    }

    return stationData;
}

function getAverageTemperature(temperatures: number[]): number {
    const validTemperatures = temperatures.filter(temperature => temperature !== -999);
    const sumTemperatures = validTemperatures.reduce((sum, temperature) => sum + temperature, 0);
    return sumTemperatures / validTemperatures.length;
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

