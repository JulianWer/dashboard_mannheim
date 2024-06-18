import LeafletMapTemperature from "./LeafletMapTemperature.tsx";
import BarChart from "./BarChart.tsx";
import {useState} from "react";
import "leaflet/dist/leaflet.css";
import ExtraInfoCard from "./ExtraInfoCard.tsx";
import LineChart from "./LineChart.tsx";


export interface IStation {
    latitude: number;
    longitude: number;
    networkNumber: string,
    name: string,
    stationsId: string,
    stationsIdSupplement: string,
    temperatures?: Array<number>,
    averageTemperature?: number,
    temperaturesWithTimestamp?: TimeTemp[]
}

export type StationData = Record<string, IStation>;
export type TimeTemp = {timestamp: Date, temperature: number}

export default function Dashboard() {

    const [selectedStation, setSelectedStation] = useState<IStation | undefined>(undefined);

    const initialStations: IStation[] = [
        {
            name: "T-032",
            networkNumber: "01/01",
            stationsId: "014",
            stationsIdSupplement: "2/1",
            latitude: 49.496764,
            longitude: 8.474376
        },
        {
            name: "T-031",
            networkNumber: "01/01",
            stationsId: "013",
            stationsIdSupplement: "2/1",
            latitude: 49.49765,
            longitude: 8.474827
        },
        {
            name: "T-026",
            networkNumber: "01/01",
            stationsId: "009",
            stationsIdSupplement: "2/1",
            latitude: 49.499061,
            longitude: 8.475401
        },
        {
            name: "T-033",
            networkNumber: "01/01",
            stationsId: "015",
            stationsIdSupplement: "2/1",
            latitude: 49.501791,
            longitude: 8.476447
        },
        {
            name: "T-043",
            networkNumber: "01/01",
            stationsId: "023",
            stationsIdSupplement: "2/1",
            latitude: 49.504888,
            longitude: 8.477162
        },
    ];


    return (
        <div style={{width: "100%", display: "flex", gap: "1rem"}}>
            <LeafletMapTemperature selectedStation={selectedStation} setSelectedStation={setSelectedStation}/>
            <div>
                <BarChart selectedStation={selectedStation} setSelectedStation={setSelectedStation}/>
                <ExtraInfoCard selectedStation={selectedStation} setSelectedStation={setSelectedStation}/>
                <LineChart date="2024-04-07" selectedStations={initialStations} setSelectedStation={setSelectedStation} />
            </div>
        </div>
    )
}


