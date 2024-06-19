import {useEffect, useState} from "react";
import LeafletMapTemperature from "./LeafletMapTemperature.tsx";
import "leaflet/dist/leaflet.css";
import BarChart from "./BarChart.tsx";
import ExtraInfoCard from "./ExtraInfoCard.tsx";
import LineChart from "./LineChart.tsx";
import {Card} from "@/components/ui/card.tsx";


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
export type TimeTemp = { timestamp: Date, temperature: number }

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

export default function Dashboard() {
    const [isInGuidedMode, setIsInGuidedMode] = useState<boolean>(false);
    const [selectedStations, setSelectedStations] = useState<IStation[]>([]);
    useEffect(() => {
            if (isInGuidedMode) {
                setSelectedStations(initialStations);
            } else {
                setSelectedStations([]);
            }

        }
        , [isInGuidedMode]);

    return (
        <div className="flex flex-wrap justify-around p-4">
            <Card>
                <LeafletMapTemperature
                    selectedStations={selectedStations}
                    setSelectedStations={setSelectedStations}
                    isInGuidedMode={isInGuidedMode}
                    setIsInGuidedMode={setIsInGuidedMode}
                />
            </Card>
            <div>
                <Card>
                    <BarChart selectedStations={selectedStations} setSelectedStations={setSelectedStations}/>
                </Card>

                <Card>
                    <LineChart
                        date="2024-04-07"
                        displayedStations={isInGuidedMode ? initialStations : []}
                        selectedStations={selectedStations}
                        setSelectedStations={setSelectedStations}
                    />
                </Card>

                <ExtraInfoCard
                    selectedStation={selectedStations.length > 0 ? selectedStations[selectedStations.length - 1] : undefined}
                    isInGuidedMode={isInGuidedMode}
                />

            </div>
        </div>

    );
}
