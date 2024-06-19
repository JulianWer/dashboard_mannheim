import {IStation} from "./Dashboard.tsx";
import "./styles/ExtraInfoCard.css"
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

interface IExtraInfoCard {
    selectedStation: IStation | undefined;
    isInGuidedMode: boolean;
}

export default function ExtraInfoCard(props: IExtraInfoCard) {
    const {selectedStation, isInGuidedMode} = props;
    return (
        <div>
            {selectedStation ? (
                <div>
                    {isInGuidedMode ? (
                        <Card style={{
                            height: "25vh",
                            overflow: "auto",
                            width: "30vw",
                            padding: "10px",
                        }}>
                            <CardContent>
                                <h4 style={{margin: "0", fontSize: "1.5vh", fontWeight: "bold"}}>Willkommen im
                                    Guide-Modus!</h4>
                                <p style={{fontSize: "1.5vh"}}>Die für dich ausgewählten Stationen
                                    befinden sich alle
                                    auf
                                    der Max-Joseph-Straße. Wie dir vielleicht bereits aufgefallen ist, nimmt die
                                    Temperatur
                                    von Station zu Station ab, umso weiter wir uns von der alten Feuerwache entfernen.
                                    Der
                                    Temperaturunterschied zu diesem Zeitpunkt zwischen der ersten und letzten Station
                                    auf
                                    dieser Straße beträgt ganze 5 Grad. </p>
                                <p style={{fontSize: "1.5vh"}}>Außerdem interessant ist, dass wir uns
                                    im Verlauf der
                                    Max-Joseph-Straße immer weiter dem Herzogenriedpark annähern. Dieser Park stellt mit
                                    seiner überdurchschnittlich hohen Begrünung und sehr geringen Versiegelung eine
                                    natürliche Abkühlungszone dar, die sich positiv auf ihre Umgebung auswirkt.</p>
                                <p style={{fontSize: "1.5vh"}}>Erkunde gerne noch weiter die
                                    ausgewählten Messstationen
                                    und
                                    die dazu gehörigen Visualisierungen oder kehre in den Explore-Modus zurück.</p>
                            </CardContent>
                        </Card>

                    ) : (

                        <Card style={{
                            height: "25vh",
                            overflow: "auto",
                            width: "30vw",
                            padding: "10px",
                        }}>
                            <CardContent>
                                <p style={{fontSize: "2.5vh", margin: "0"}}>Name: {selectedStation.name}</p>
                                <p style={{
                                    fontSize: "2.5vh",
                                    margin: "5"
                                }}>Temperatur: {selectedStation.averageTemperature !== undefined ? selectedStation.averageTemperature.toFixed(2) : 'N/A'}°C</p>
                                <p style={{fontSize: "2.5vh", margin: "5"}}>Breitengrad: {selectedStation.latitude}</p>
                                <p style={{fontSize: "2.5vh", margin: "5"}}>Längengrad: {selectedStation.longitude}</p>


                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={"bg-blue-500 text-white hover:bg-blue-600"}
                                    onClick={() => window.location.href = `https://maps.google.com/maps?q=&layer=c&cbll=${selectedStation.latitude},${selectedStation.longitude}&cbp=11,0,0,0,0`}
                                >
                                    Google Street View
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            ) : (
                <Card style={{
                    height: "25vh",
                    overflow: "auto",
                    width: "30vw",
                    padding: "10px",
                }}>
                    <CardContent>
                        <h4 style={{margin: "0", fontSize: "1.8vh", fontWeight: "bold"}}>Willkommen im
                            Explore-Modus!</h4>
                        <p style={{fontSize: "1.8vh"}}>Dieses Dashboard zeigt Temperaturwerte der Messstationen in der
                            Neckarstadt.</p>
                        <p style={{fontSize: "1.8vh"}}>Der Fokus dieser Arbeit liegt auf der Abkühlung der Stationen.
                            Daher
                            wird für jeden ausgewählten Tag die Temperatur um 6 Uhr morgens verglichen.</p>
                        <p style={{fontSize: "1.8vh"}}>Wähle eine Station, um weitere Informationen zu erhalten!</p>
                    </CardContent>
                </Card>
                /*<div style={{
                    height: "25vh",
                    width: "30vw",
                    padding: "10px",
                    marginLeft: "15px"
                }}>
                    <h4 style={{margin: "0", fontSize: "1.8vh"}}>Willkommen im Explore-Modus!</h4>
                    <p style={{fontSize: "1.8vh"}}>Dieses Dashboard zeigt Temperaturwerte der Messstationen in der
                        Neckarstadt.</p>
                    <p style={{fontSize: "1.8vh"}}>Der Fokus dieser Arbeit liegt auf der Abkühlung der Stationen. Daher
                        wird für jeden ausgewählten Tag die Temperatur um 4 Uhr morgens verglichen.</p>
                    <p style={{fontSize: "1.8vh"}}>Wähle eine Station, um weitere Informationen zu erhalten!</p>
                </div>*/
            )}

        </div>
    )

}
