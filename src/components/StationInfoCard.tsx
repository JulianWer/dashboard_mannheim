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
        }}>

            <CardHeader className="flex justify-center items-center pt-2">
                <CardTitle className="text-base sm:text-sm lg:text-lg xl:text-xl">Station-Info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center gap-4 mt-4 mb-4">
                {selectedStations && selectedStations.length === 0 && (
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col items-center">
                            <p className="text-base sm:text-sm lg:text-lg xl:text-xl m-0">Datum</p>
                            <p className="text-base sm:text-sm lg:text-lg xl:text-xl font-semibold">{moment(date).format("DD.MM.YYYY")}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-base sm:text-sm lg:text-lg xl:text-xl m-0">Zeitraum</p>
                            <p className="text-base sm:text-sm lg:text-lg xl:text-xl font-semibold">{time}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-base sm:text-sm lg:text-lg xl:text-xl m-0">Anzahl Stationen</p>
                            <p className="text-base sm:text-sm lg:text-lg xl:text-xl font-bold">{temperaturesForAllStationsHelper.length}</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="text-base sm:text-sm lg:text-lg xl:text-xl m-0">Min {'\u2300'} Temperatur</p>
                            <p className="text-base sm:text-sm lg:text-lg xl:text-xl font-bold">{getInfoData.minTemperature}°C</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-base sm:text-sm lg:text-lg xl:text-xl m-0">{'\u2300'} Temperatur Differenz</p>
                            <p className="text-base sm:text-sm lg:text-lg xl:text-xl font-bold">{getInfoData.temperatureDifference}°C</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-base sm:text-sm lg:text-lg xl:text-xl m-0">Max {'\u2300'} Temperatur</p>
                            <p className="text-base sm:text-sm lg:text-lg xl:text-xl font-bold">{getInfoData.maxTemperature}°C</p>
                        </div>
                    </div>
                )}
                {selectedStation && selectedStations.length === 1 && (
                    <div className="flex flex-col justify-center items-center space-y-4">
                        <div className="flex justify-center items-center space-x-24">
                            <div className="flex flex-col items-center">
                                <p className="text-base sm:text-sm lg:text-lg xl:text-xl m-0">Datum</p>
                                <p className="text-base sm:text-sm lg:text-lg xl:text-xl font-semibold">{moment(date).format("DD.MM.YYYY")}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="text-base sm:text-sm lg:text-lg xl:text-xl m-0">Zeitraum</p>
                                <p className="text-base sm:text-sm lg:text-lg xl:text-xl font-semibold">{time}</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center space-x-24">
                            <div className="flex flex-col items-center">
                                <p className="text-base sm:text-sm lg:text-lg xl:text-xl m-0">Name</p>
                                <p className="text-base sm:text-sm lg:text-lg xl:text-xl font-bold">{selectedStation.name}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="text-base sm:text-sm lg:text-lg xl:text-xl m-0">{'\u2300'} Temperatur</p>
                                <p className="text-base sm:text-sm lg:text-lg xl:text-xl font-bold">{selectedStation.averageTemperature !== undefined ? selectedStation.averageTemperature.toFixed(2) : 'N/A'}°C</p>
                            </div>
                        </div>
                    </div>
                )}
                {selectedStations && selectedStations.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center">
                            <p className="text-sm sm:text-xs lg:text-base xl:text-lg m-0">Datum</p>
                            <p className="text-sm sm:text-xs lg:text-base xl:text-lg font-semibold">{moment(date).format("DD.MM.YYYY")}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm sm:text-xs lg:text-base xl:text-lg m-0">Zeitraum</p>
                            <p className="text-sm sm:text-xs lg:text-base xl:text-lg font-semibold">{time}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm sm:text-xs lg:text-base xl:text-lg m-0">Anzahl Stationen</p>
                            <p className="text-sm sm:text-xs lg:text-base xl:text-lg font-bold">{selectedStations.length !== 0 ? selectedStations.length : temperaturesForAllStationsHelper.length}</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="text-sm sm:text-xs lg:text-base xl:text-lg m-0">Min {'\u2300'} Temperatur</p>
                            <p className="text-sm sm:text-xs lg:text-base xl:text-lg font-bold">{getInfoData.minTemperature}°C</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm sm:text-xs lg:text-base xl:text-lg m-0">Max {'\u2300'} Temperatur</p>
                            <p className="text-sm sm:text-xs lg:text-base xl:text-lg font-bold">{getInfoData.maxTemperature}°C</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm sm:text-xs lg:text-base xl:text-lg m-0">{'\u2300'} Temperatur Differenz</p>
                            <p className="text-sm sm:text-xs lg:text-base xl:text-lg font-bold">{getInfoData.temperatureDifference}°C</p>
                        </div>
                    </div>)}

                <div className={selectedStations.length === 0 ? ("mt-1") : ("mt-4")}>
                    <Legend dataFromStations={dataFromStations}
                            minTemperature={selectedStations.length > 1 ? getInfoData.minTemperature : undefined}
                            maxTemperature={selectedStations.length > 1 ? getInfoData.maxTemperature : undefined}/>
                </div>

            </CardContent>
            <CardFooter className="flex justify-center items-center gap-2">
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
