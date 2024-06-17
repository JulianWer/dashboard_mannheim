import {IStation} from "./Dashboard.tsx";


interface IExtraInfoCard {
    selectedStation: IStation | undefined;
    setSelectedStation: React.Dispatch<React.SetStateAction<IStation | undefined>>;
}

export default function ExtraInfoCard(props: IExtraInfoCard) {
    const {selectedStation} = props;
    return (
        <div style={{border: "1px solid", height: "25rem", borderRadius: "0.5rem"}}>
            {selectedStation ? (
                <div>
                    <h1>Name: {selectedStation.name}</h1>
                    <h2>Temperature: {selectedStation.averageTemperature}</h2>
                    <h2>Lat: {selectedStation.latitude}</h2>
                    <h2>Log: {selectedStation.longitude}</h2>
                    <a href={
                        `https://maps.google.com/maps?q=&layer=c&cbll=${selectedStation.latitude},${selectedStation.longitude}&cbp=11,0,0,0,0`}>
                        Google street view
                    </a>

                </div>
            ) : (
                <div>
                    <h1>No station selected</h1>
                </div>
            )}
        </div>
    )

}
