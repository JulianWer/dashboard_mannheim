import {useCallback, useEffect, useState} from "react";
import LeafletMapTemperature from "./LeafletMapTemperature.tsx";
import "leaflet/dist/leaflet.css";
import BarChart from "./BarChart.tsx";
import ExtraInfoCard from "./ExtraInfoCard.tsx";
import {getStationData} from "../utils/DataHandler.ts";
import {DatePicker} from "./DatePicker.tsx";


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
    const [temperaturesForAllStations, setTemperaturesForAllStations] = useState<{ [key: string]: IStation }>({});
    const [selectedDate, setSelectedDate] = useState<string>("2024-04-07");

    const fetchData = useCallback(async () => {
        const data = await getStationData(selectedDate);
        setTemperaturesForAllStations(data);
    }, [selectedDate])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
            if (isInGuidedMode) {
                setSelectedStations(initialStations);
            } else {
                setSelectedStations([]);
            }

        }
        , [isInGuidedMode]);

    return (
        <div style={{width: "100%", display: "flex", gap: "1rem"}}>
            <div>
                <button type="button" onClick={() => setIsInGuidedMode(false)}>Explore</button>
                <button type="button" onClick={() => setIsInGuidedMode(true)}>Guide</button>
                <LeafletMapTemperature selectedStations={selectedStations}
                                       setSelectedStations={setSelectedStations} isInGuidedMode={isInGuidedMode}
                                       temperaturesForAllStations={temperaturesForAllStations}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', padding: '10px', gap: '10px'}}>
                <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
                <BarChart selectedStations={selectedStations} setSelectedStations={setSelectedStations}
                          dataFromStations={temperaturesForAllStations}/>
                <ExtraInfoCard
                    selectedStation={selectedStations.length > 0 ? selectedStations[selectedStations.length - 1] : undefined}
                    isInGuidedMode={isInGuidedMode}/>
            </div>

        </div>
    );
}
