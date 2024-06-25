import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {IStation, StationData} from "@/components/Dashboard.tsx";
import {useCallback, useEffect, useMemo, useState} from "react";
import {getStationData} from "@/utils/DataHandler.ts";

interface IStationInfoCard {
    date: string;
    selectedStation: IStation | undefined;
    selectedStations: IStation[] | undefined
    setSelectedStations: React.Dispatch<React.SetStateAction<IStation[]>>;
    isInGuidedMode: boolean;
}

export default function StationInfoCard(props: IStationInfoCard) {
    const {selectedStation, isInGuidedMode, setSelectedStations, selectedStations, date} = props;
    const [dataFromStations, setDataFromStations] = useState<StationData>({});


    const fetchData = useCallback(async () => {
        const data: StationData = await getStationData(date, "06:30", 1);
        setDataFromStations(data);
    }, [date]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const temperaturesForAllStationsHelper = Object.values(dataFromStations).map((value: IStation) => value);

    const getMinTemperature = useMemo((): number => {
        return parseFloat(
            Math.min(...(selectedStations.length === 0 ? temperaturesForAllStationsHelper : selectedStations).map(station => station.averageTemperature !== undefined ? station.averageTemperature : 0)).toFixed(2)
        );
    }, [selectedStations, temperaturesForAllStationsHelper]);

    const getMaxTemperature = useMemo((): number => {
        return parseFloat(
            Math.max(...(selectedStations.length === 0 ? temperaturesForAllStationsHelper : selectedStations).map(station => station.averageTemperature !== undefined ? station.averageTemperature : 0)).toFixed(2)
        );
    }, [selectedStations, temperaturesForAllStationsHelper]);

    const getTemperatureDifference = useMemo((): number => {
        return parseFloat(
            (getMaxTemperature - getMinTemperature).toFixed(2)
        );
    }, [getMaxTemperature, getMinTemperature]);


    return (

        <Card className="bg-white shadow-gray-400 shadow-lg rounded-3xl p-4"style={{
            width: "30vw",
        }}>
        
            <CardHeader className="flex justify-center items-center">
                <CardTitle className="text-4xl font-bold">Station-Info</CardTitle>
            </CardHeader>
            <CardContent>
                {selectedStation && selectedStations.length === 1 && (
                    <div className="flex justify-center items-center space-x-8 p-4">
                        <div className="flex flex-col items-center">
                            <p className="text-2xl font-semibold m-0">Name</p>
                            <p className="text-4xl font-bold">{selectedStation.name}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-2xl font-semibold m-0">Temperatur</p>
                            <p className="text-4xl font-bold">{selectedStation.averageTemperature !== undefined ? selectedStation.averageTemperature.toFixed(2) : 'N/A'}°C</p>
                        </div>
                    </div>
                )}
                {(selectedStations.length > 1 || selectedStations.length === 0) && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center">
                            <p className="text-xl font-semibold m-0">Anzahl Stationen</p>
                            <p className="text-3xl font-bold">{selectedStations.length !== 0 ? selectedStations.length : temperaturesForAllStationsHelper.length}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-xl font-semibold m-0">Temperatur Differenz</p>
                            <p className="text-3xl font-bold">{getTemperatureDifference}°C</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-xl font-semibold m-0">Max Temperatur</p>
                            <p className="text-3xl font-bold">{getMaxTemperature}°C</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-xl font-semibold m-0">Min Temperatur</p>
                            <p className="text-3xl font-bold">{getMinTemperature}°C</p>
                        </div>
                    </div>)}


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
