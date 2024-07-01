import { useCallback, useEffect, useState } from "react";
import LeafletMapTemperature from "./LeafletMapTemperature.tsx";
import "leaflet/dist/leaflet.css";
import BarChart from "./BarChart.tsx";
import ExtraInfoCard from "./ExtraInfoCard.tsx";
import LineChart from "./LineChart.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DatePicker } from "@/components/DatePicker.tsx";
import StationInfoCard from "@/components/StationInfoCard.tsx";
import { getStationData } from "@/utils/DataHandler.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import dataStoriesStations from "../dataStoriesStations.json";


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

const CardSkeleton = () => {
    return (
        <Skeleton className="p-4 shadow rounded-lg bg-gray-200 mb-4">
            <div className="mb-4">
                <Skeleton className="h-8 w-3/4 rounded" />
            </div>
            <div className="flex justify-center">
                <Skeleton className="h-96 w-full rounded" />
            </div>
        </Skeleton>
    );
};

export default function Dashboard() {
    const [isInGuidedMode, setIsInGuidedMode] = useState<boolean>(false);
    const [selectedStations, setSelectedStations] = useState<IStation[]>([]);
    const [date, setDate] = useState<string>("2024-04-07");
    const [selectedDataStory, setSelectedDataStory] = useState<number>(1);
    const [data, setData] = useState<{ data: StationData, timeFilteredData: StationData }>({
        data: undefined,
        timeFilteredData: undefined
    });

    const handleGuideMode = (storyNumber: number) => {
        setIsInGuidedMode(true);
        if (storyNumber === 1 || storyNumber === 2) {
            setDate("2024-04-07");
        } else {
            setDate("2024-05-05");
        }
    };


    useEffect(() => {
        if (isInGuidedMode) {
            if (selectedDataStory === 1) {
                setSelectedStations(dataStoriesStations.dataStoryOne)
            } else if (selectedDataStory === 2) {
                setSelectedStations(dataStoriesStations.dataStory2)
            } else {
                setSelectedStations(dataStoriesStations.dataStory3)
            }
        }

    }
        , [isInGuidedMode, selectedDataStory]);

    const fetchData = useCallback(async () => {
        const currentData = await getStationData(date, "06:30", 1);
        setData(currentData);
    }, [date]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    return (<>
        {data.data === undefined && data.timeFilteredData === undefined && (
            <div className="flex flex-col min-h-screen p-6">
                <div className="mb-4">
                    <Skeleton className="h-4 bg-gray-200 rounded w-full"></Skeleton>
                </div>
                <div className="flex-grow flex justify-end">
                    <div className="w-full md:w-1/3">
                        <CardSkeleton />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
        )}
        {data.data && data.timeFilteredData && (

            <>
                <div className="absolute w-full h-screen">
                    <div className="relative top-0 left-0 w-full bg-white text-black flex items-center justify-between p-2 shadow-md z-50" style={{ height: "5vh" }}>
                        <DatePicker setSelected={setDate} selected={date} isInGuidedMode={isInGuidedMode}
                        />
                        <div className="flex items-center space-x-4">
                            <h1 style={{ fontSize: "2.6vh", fontWeight: "bold" }}>Neckarstadt KliMA</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button
                                style={{ fontSize: "2vh", width: "5vw", height: "3vh" }}
                                className={` px-4 py-2 ${!isInGuidedMode ? 'bg-[#3572EF] text-white hover:bg-[#3572EF]' : 'bg-white text-black hover:bg-gray-200'} focus:outline-none`}
                                type="button"
                                variant={"outline"}
                                onClick={() => {
                                    setIsInGuidedMode(false);
                                    setSelectedStations([]);
                                }}
                            >
                                Explore
                            </Button>
                            <Button
                                style={{ fontSize: "2vh", width: "5vw", height: "3vh" }}
                                className={`px-4 py-2 ${isInGuidedMode ? 'bg-[#3572EF] text-white hover:bg-[#3572EF]' : 'bg-white text-black hover:bg-gray-200'} focus:outline-none`}
                                type="button"
                                variant={"outline"}
                                onClick={() => handleGuideMode(1)}
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
                        <div className="transform translate-x-custom flex space-x-4 z-1000" style={{
                            position: "absolute",
                            top: "7vh",
                            right: "1vw",
                        }}>

                            <ExtraInfoCard
                                selectedDataStory={selectedDataStory}
                                setSelectedDataStory={setSelectedDataStory}
                                isInGuidedMode={isInGuidedMode}
                                handleGuideMode={handleGuideMode}
                            />
                        </div>
                        <div
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-1000" style={{
                                paddingBottom: "1vh",
                            }}>
                            <Card className="bg-white shadow-gray-400 shadow-lg rounded-3xl p-0" style={{
                                width: "32vw",
                                height: "38vh",
                            }}>
                                <CardHeader className="flex justify-center items-center p-0 pt-2" style={{ paddingTop: "2vh", paddingBottom: "0" }}>
                                    <CardTitle className="text-base" style={{ fontSize: "1.7vh" }}>Temperaturverlauf
                                        über 24h</CardTitle>
                                </CardHeader>
                                <CardContent style={{
                                    paddingLeft: "1vw",
                                    paddingRight: "1vw",
                                    paddingBottom: "0"
                                }}>
                                    <LineChart
                                        data={data.data}
                                        date={date}
                                        displayedStations={isInGuidedMode ? selectedStations : []}
                                        selectedStations={selectedStations} />
                                </CardContent>
                            </Card>
                            <Card className="bg-white shadow-gray-400 shadow-lg rounded-3xl " style={{
                                width: "32vw",
                                height: "38vh",
                            }}>
                                <CardHeader className="flex justify-center items-center" style={{ paddingTop: "2vh", paddingBottom: "0" }}>
                                    <CardTitle className="text-base" style={{ fontSize: "1.7vh" }}>Durchschnittstemperatur
                                        zwischen 5:30 und 6:30</CardTitle>
                                </CardHeader>
                                <CardContent style={{
                                    paddingLeft: "1vw",
                                    paddingRight: "1vw",
                                    paddingBottom: "0"
                                }}>
                                    <BarChart
                                        dataFromStations={data.timeFilteredData}
                                        isInGuidedMode={isInGuidedMode}
                                        selectedStations={selectedStations}
                                        setSelectedStations={setSelectedStations} />
                                </CardContent>
                            </Card>
                            <StationInfoCard
                                dataFromStations={data.timeFilteredData}
                                selectedStation={selectedStations.length > 0 ? selectedStations[selectedStations.length - 1] : undefined}
                                selectedStations={selectedStations} setSelectedStations={setSelectedStations}
                                isInGuidedMode={isInGuidedMode}
                                date={date}
                                time="05.30 - 06.30 Uhr" />
                        </div>
                    </div>


                </div>
            </>
        )}
    </>
    );
}
