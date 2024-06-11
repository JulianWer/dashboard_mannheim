import LeafletMapTemperature from "./LeafletMapTemperature.tsx";
import BarChart from "./BarChart.tsx";
import {useState} from "react";
import "leaflet/dist/leaflet.css";


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

export default function Dashboard () {

 const [selectedStation, setSelectedStation] = useState<IStation | undefined>(undefined);
 console.log("=>(Dashboard.tsx:21) selectedStation", selectedStation);


    return (
        <div style={{width:"100%",display:"flex"}}>
        <LeafletMapTemperature selectedStation={selectedStation} setSelectedStation={setSelectedStation}/>
        <BarChart selectedStation={selectedStation} setSelectedStation={setSelectedStation}/>
        </div>
    )
}


