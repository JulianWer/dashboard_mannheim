import { useState } from "react";
import LeafletMapTemperature from "./LeafletMapTemperature.tsx";
import "leaflet/dist/leaflet.css";
import BarChart from "./BarChart.tsx";


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

const initialStations: IStation[] = [
    { name: "T-032", networkNumber: "01/01", stationsId: "014", stationsIdSupplement: "2/1", latitude: 49.496764, longitude: 8.474376 },
    { name: "T-031", networkNumber: "01/01", stationsId: "013", stationsIdSupplement: "2/1", latitude: 49.49765, longitude: 8.474827 },
    { name: "T-026", networkNumber: "01/01", stationsId: "009", stationsIdSupplement: "2/1", latitude: 49.499061, longitude: 8.475401 },
    { name: "T-033", networkNumber: "01/01", stationsId: "015", stationsIdSupplement: "2/1", latitude: 49.501791, longitude: 8.476447 },
    { name: "T-043", networkNumber: "01/01", stationsId: "023", stationsIdSupplement: "2/1", latitude: 49.504888, longitude: 8.477162 },
];

export default function Dashboard() {
    const [selectedStations, setSelectedStations] = useState<IStation[]>(initialStations);

    return (
        <div style={{ width: "100%", display: "flex", gap: "1rem" }}>
            <LeafletMapTemperature selectedStations={selectedStations} setSelectedStations={setSelectedStations} />            
                {/* Weitere Komponenten können hier hinzugefügt werden */}
            <div>
                <BarChart selectedStations={selectedStations} setSelectedStation={setSelectedStations}/>
            </div>
        </div>
    );
}
