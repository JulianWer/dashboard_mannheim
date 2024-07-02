import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {IStation, StationData} from "@/components/Dashboard.tsx";
import {useMemo} from "react";
import Legend from "@/components/Legend.tsx";
import moment from "moment-timezone";

interface IStationInfoCard {
    dataFromStations: StationData;
    selectedStation: IStation | undefined;
    selectedStations: IStation[] | undefined;
    setSelectedStations: React.Dispatch<React.SetStateAction<IStation[]>>;
    isInGuidedMode: boolean;
    date: string;
    time: string;
}

type InfoData = {
    minTemperature: number,
    maxTemperature: number,
    temperatureDifference: number,
}

export default function StationInfoCard(props: IStationInfoCard) {
    const {
        selectedStation,
        isInGuidedMode,
        setSelectedStations,
        selectedStations,
        dataFromStations,
        date,
        time
    } = props;
    const temperaturesForAllStationsHelper: IStation[] = Object.values(dataFromStations).map((value: IStation) => value);

    const getInfoData: InfoData = useMemo((): InfoData => {
        const selectedStationsIDs: string[] = selectedStations.map((station: IStation): string => station.stationsId);
        const selectedStationsData: IStation[] = temperaturesForAllStationsHelper.filter((station: IStation): boolean => selectedStationsIDs.includes(station.stationsId));
        const averageTemperatures: number[] = (selectedStations.length === 0 ? temperaturesForAllStationsHelper : selectedStationsData).map((station: IStation): number => station.averageTemperature || 0);

        const minTemperature: number = parseFloat(Math.min(...averageTemperatures).toFixed(2));
        const maxTemperature: number = parseFloat(Math.max(...averageTemperatures).toFixed(2));
        const temperatureDifference: number = parseFloat((maxTemperature - minTemperature).toFixed(2));

        return {
            minTemperature,
            maxTemperature,
            temperatureDifference
        };
    }, [selectedStations, temperaturesForAllStationsHelper]);


    return (

        <Card className="bg-white shadow-gray-400 shadow-lg rounded-3xl" style={{
            width: "32vw",
            height: "38vh",

        }}>

            <CardHeader className="flex justify-center items-center pt-2" style={{ paddingTop: "2vh", paddingBottom: "0.5vh" }}>
                <CardTitle className="text-base" style={{ fontSize: "1.8vh" }}>Station-Info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center" style={{ padding: "2vh 0 0 0"}}>
                {selectedStations && selectedStations.length === 0 && (
                    <div className="grid grid-cols-2" style={{ gridGap: "3vh 4vw"}}>
                        <div className="flex flex-col items-center">
                            <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Datum</p>
                            <p style={{ fontSize: "1.5vh"}}>{moment(date).format("DD.MM.YYYY")}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Zeitraum</p>
                            <p style={{ fontSize: "1.5vh"}}>{time}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Anzahl Stationen</p>
                            <p style={{ fontSize: "1.5vh"}}>{temperaturesForAllStationsHelper.length}</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>{'\u2300'} Temperatur Differenz</p>
                            <p style={{ fontSize: "1.5vh"}}>{getInfoData.temperatureDifference}°C</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Min {'\u2300'} Temperatur</p>
                            <p style={{ fontSize: "1.5vh"}}>{getInfoData.minTemperature}°C</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Max {'\u2300'} Temperatur</p>
                            <p style={{ fontSize: "1.5vh"}}>{getInfoData.maxTemperature}°C</p>
                        </div>
                    </div>
                )}
                {selectedStation && selectedStations.length === 1 && (
                    <div className="flex flex-col justify-center items-center space-y-4">
                        <div className="grid grid-cols-2" style={{ gridGap: "3vh 4vw"}}>
                            <div className="flex flex-col items-center">
                                <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Datum</p>
                                <p style={{ fontSize: "1.5vh"}}>{moment(date).format("DD.MM.YYYY")}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Zeitraum</p>
                                <p style={{ fontSize: "1.5vh"}}>{time}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Name</p>
                                <p style={{ fontSize: "1.5vh"}}>{selectedStation.name}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>{'\u2300'} Temperatur</p>
                                <p style={{ fontSize: "1.5vh"}}>{selectedStation.averageTemperature !== undefined ? selectedStation.averageTemperature.toFixed(2) : 'N/A'}°C</p>
                            </div>
                        </div>
                    </div>
                )}
                {selectedStations && selectedStations.length > 1 && (
                    <div className="grid grid-cols-2" style={{ gridGap: "3vh 4vw"}}>
                        <div className="flex flex-col items-center">
                            <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Datum</p>
                            <p style={{ fontSize: "1.5vh"}}>{moment(date).format("DD.MM.YYYY")}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Zeitraum</p>
                            <p style={{ fontSize: "1.5vh"}}>{time}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Anzahl Stationen</p>
                            <p style={{ fontSize: "1.5vh"}}>{selectedStations.length !== 0 ? selectedStations.length : temperaturesForAllStationsHelper.length}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>{'\u2300'} Temperatur Differenz</p>
                            <p style={{ fontSize: "1.5vh"}}>{getInfoData.temperatureDifference}°C</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Min {'\u2300'} Temperatur</p>
                            <p style={{ fontSize: "1.5vh"}}>{getInfoData.minTemperature}°C</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p style={{ fontSize: "1.6vh", fontWeight: "bold" }}>Max {'\u2300'} Temperatur</p>
                            <p style={{ fontSize: "1.5vh"}}>{getInfoData.maxTemperature}°C</p>
                        </div>
                    </div>)}

                <div style={{ paddingTop: "2vh"}}>
                    <Legend dataFromStations={dataFromStations}
                            minTemperature={selectedStations.length > 1 ? getInfoData.minTemperature : undefined}
                            maxTemperature={selectedStations.length > 1 ? getInfoData.maxTemperature : undefined}/>
                </div>

            </CardContent>
            <CardFooter className="flex justify-center items-center gap-2 mt-1">
                {selectedStations.length !== 0 && !isInGuidedMode && (
                    <Button
                        onClick={() => {
                            setSelectedStations([]);
                        }}
                        className="bg-red-500 text-white hover:bg-red-600 focus:outline-none"
                    >
                        Reset selection
                    </Button>
                )}
                {selectedStation && selectedStations.length === 1 && (
                    <Button
                        className="bg-[#00ADB5] text-white hover:bg-[#00ADB5]"
                        onClick={() => window.open(`https://maps.google.com/maps?q=&layer=c&cbll=${selectedStation.latitude},${selectedStation.longitude}&cbp=11,0,0,0,0`, '_blank')}
                    >
                        Google Street View
                    </Button>
                )}
            </CardFooter>
        </Card>

    );


}
