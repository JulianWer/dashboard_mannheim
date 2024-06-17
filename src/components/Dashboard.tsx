import LeafletMapTemperature from "./LeafletMapTemperature.tsx";
import BarChart from "./BarChart.tsx";
import {useState} from "react";
import "leaflet/dist/leaflet.css";
import ExtraInfoCard from "./ExtraInfoCard.tsx";


export interface IStation {
    latitude: number;
    longitude: number;
    networkNumber: string,
    name: string,
    stationsId: string,
    stationsIdSupplement: string,
    temperatures?: Array<number>;
    averageTemperature?: number
}

export default function Dashboard() {

    const [selectedStation, setSelectedStation] = useState<IStation | undefined>(undefined);


    return (
        <div style={{width: "100%", display: "flex", gap: "1rem"}}>
            <LeafletMapTemperature selectedStation={selectedStation} setSelectedStation={setSelectedStation}/>
            <div>
                <BarChart selectedStation={selectedStation} setSelectedStation={setSelectedStation}/>
                <ExtraInfoCard selectedStation={selectedStation} setSelectedStation={setSelectedStation}/>
            </div>
        </div>
    )
}


