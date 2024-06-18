import { IStation } from "./Dashboard.tsx";
import "./styles/ExtraInfoCard.css"

interface IExtraInfoCard {
    selectedStation: IStation | undefined;
    isInGuidedMode: boolean;
}

export default function ExtraInfoCard(props: IExtraInfoCard) {
    const { selectedStation, isInGuidedMode } = props;
    return (
        <div>

            {selectedStation ? (

                <div>
                    {isInGuidedMode ? (
                        <div style={{ border: "1px solid", height: "25vh", borderRadius: "0.5rem", width: "35vw", padding:"10px" }}>
                            <h4 style={{ margin: "0" }}>Willkommen im Guide-Modus!</h4>
                            <p>Die für dich ausgewählten Stationen befinden sich alle auf der Max-Joseph-Straße. Wie dir vielleicht bereits aufgefallen ist, nimmt die Temperatur von Station zu Station ab, umso weiter wir uns von der alten Feuerwache entfernen. Der Temperaturunterschied zu diesem Zeitpunkt zwischen der ersten und letzten Station auf dieser Straße beträgt ganze 5 Grad. </p>
                            <p>Außerdem interessant ist, dass wir uns im Verlauf der Max-Joseph-Straße immer weiter dem Herzogenriedpark annähern. Dieser Park stellt mit seiner überdurchschnittlich hohen Begrünung und sehr geringen Versiegelung eine natürliche Abkühlungszone dar, die sich positiv auf ihre Umgebung auswirkt.</p>
                            <p>Erkunde gerne noch weiter die ausgewählten Messstationen und die dazu gehörigen Visualisierungen oder kehre in den Explore-Modus zurück.</p>
                        </div>
                    ) : (
                        <div style={{ border: "1px solid", height: "25vh", borderRadius: "0.5rem", width: "20vw", padding:"10px" }}>
                            <h2>Name: {selectedStation.name}</h2>
                            <h2>Temperatur: {selectedStation.averageTemperature.toFixed(2)}°C</h2>
                            <h2>Breitengrad: {selectedStation.latitude}</h2>
                            <h2>Längengrad: {selectedStation.longitude}</h2>
                            <a href={
                                `https://maps.google.com/maps?q=&layer=c&cbll=${selectedStation.latitude},${selectedStation.longitude}&cbp=11,0,0,0,0`}>
                                Google street view
                            </a>
                        </div>
                    )}


                </div>
            ) : (
                <div style={{ border: "1px solid", height: "25vh", borderRadius: "0.5rem", width: "20vw", padding:"10px" }}>
                    <h4 style={{ margin: "0" }}>Willkommen im Explore-Modus!</h4>
                    <p>Dieses Dashboard zeigt Temperaturwerte der Messstationen in der Neckarstadt.</p>
                    <p>Der Fokus dieser Arbeit liegt auf der Abkühlung der Stationen. Daher wird für jeden ausgewählten Tag die Temperatur um 4 Uhr morgens verglichen</p>
                    <p>Wähle eine Station, um weitere Informationen zu erhalten!</p>
                </div>
            )}

        </div>
    )

}
