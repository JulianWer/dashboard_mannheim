import {useEffect, useState} from "react";
import LeafletMapTemperature from "./LeafletMapTemperature.tsx";
import "leaflet/dist/leaflet.css";
import BarChart from "./BarChart.tsx";
import ExtraInfoCard from "./ExtraInfoCard.tsx";
import LineChart from "./LineChart.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DatePicker} from "@/components/DatePicker.tsx";
import Legend from "@/components/Legend.tsx";
import StationInfoCard from "@/components/StationInfoCard.tsx";


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

const initialStations = {
    dataStoryOne: [
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
    ], dataStory2: [
        {
            name: "T-016",
            networkNumber: "01/01",
            stationsId: "001",
            stationsIdSupplement: "2/1",
            latitude: 49.496318,
            longitude: 8.475067
        },
        {
            name: "T-032",
            networkNumber: "01/01",
            stationsId: "014",
            stationsIdSupplement: "2/1",
            latitude: 49.496764,
            longitude: 8.474376
        },
        {
            name: "T-034",
            networkNumber: "01/01",
            stationsId: "016",
            stationsIdSupplement: "2/1",
            latitude: 49.4965,
            longitude: 8.47394
        },
        {
            name: "T-023",
            networkNumber: "01/01",
            stationsId: "006",
            stationsIdSupplement: "2/1",
            latitude: 49.497052,
            longitude: 8.472246
        },
        {
            name: "T-051",
            networkNumber: "01/01",
            stationsId: "029",
            stationsIdSupplement: "2/1",
            latitude: 49.50082,
            longitude: 8.484689
        },
        {
            name: "T-058",
            networkNumber: "01/01",
            stationsId: "033",
            stationsIdSupplement: "2/1",
            latitude: 49.501145,
            longitude: 8.481736
        },
        {
            name: "T-060",
            networkNumber: "01/01",
            stationsId: "035",
            stationsIdSupplement: "2/1",
            latitude: 49.501537,
            longitude: 8.478834
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
    ]
}


export default function Dashboard() {
    const [isInGuidedMode, setIsInGuidedMode] = useState<boolean>(false);
    const [selectedStations, setSelectedStations] = useState<IStation[]>([]);
    const [date, setDate] = useState<string>("2024-04-07");
    const [selectedDataStory, setSelectedDataStory] = useState<number>(1);

    useEffect(() => {
            if (isInGuidedMode) {
                selectedDataStory === 1 ? setSelectedStations(initialStations.dataStoryOne) : setSelectedStations(initialStations.dataStory2);
            } else {
                setSelectedStations([]);
            }

        }
        , [isInGuidedMode, selectedDataStory]);

    return (
        <>
            <div className="absolute w-full h-screen">
                <div
                    className="relative top-0 left-0 w-full bg-white text-black flex items-center  justify-between p-2 shadow-md z-50">
                    <DatePicker setSelected={setDate} selected={date} isInGuidedMode={isInGuidedMode}
                    />
                    <div className="flex items-center space-x-4">
                        <img src={"/extension_icon.png"} alt="Custom Icon" className={"h-8"}/>
                        <h1 className=" px-4 py-2 text-xl font-bold">Neckarstadt KliMA</h1>
                    </div>
                    <Legend
                    />

                    <div className="flex items-center space-x-4">
                        <Button
                            className={` px-4 py-2 ${!isInGuidedMode ? 'bg-[#00ADB5] text-white hover:bg-[#00ADB5]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                            type="button"
                            onClick={() => setIsInGuidedMode(false)}
                        >
                            Explore
                        </Button>
                        <Button
                            className={`px-4 py-2 ${isInGuidedMode ? 'bg-[#00ADB5] text-white hover:bg-[#00ADB5]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                            type="button"
                            onClick={() => setIsInGuidedMode(true)}
                        >
                            Guide
                        </Button>
                    </div>

                </div>
                <LeafletMapTemperature
                    selectedStations={selectedStations}
                    date={date}
                    setSelectedStations={setSelectedStations}
                    isInGuidedMode={isInGuidedMode}
                    setIsInGuidedMode={setIsInGuidedMode}
                />

                <div className=" w-full">
                    <div
                        className="absolute top-20 right-5 transform translate-x-custom md:bottom-8 lg:bottom-12 flex space-x-4 z-1000"
                    >
                        <ExtraInfoCard
                            selectedDataStory={selectedDataStory}
                            setSelectedDataStory={setSelectedDataStory}
                            isInGuidedMode={isInGuidedMode}
                        />
                    </div>
                    <div
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 md:bottom-8 lg:bottom-12 flex space-x-4 z-1000">
                        <Card className="bg-white shadow-gray-400 shadow-lg rounded-3xl p-4">
                            <BarChart
                                date={date}
                                isInGuidedMode={isInGuidedMode}
                                selectedStations={selectedStations} setSelectedStations={setSelectedStations}/>
                        </Card>
                        <Card className="bg-white shadow-gray-400 shadow-lg rounded-3xl p-4">
                            <LineChart
                                date={date}
                                displayedStations={isInGuidedMode ? initialStations.dataStoryOne : []}
                                selectedStations={selectedStations}
                            />
                        </Card>
                        <StationInfoCard
                            date={date}
                            selectedStation={selectedStations.length > 0 ? selectedStations[selectedStations.length - 1] : undefined}
                            selectedStations={selectedStations} setSelectedStations={setSelectedStations}
                            isInGuidedMode={isInGuidedMode}/>
                    </div>
                </div>
            </div>
        </>
    );
}
