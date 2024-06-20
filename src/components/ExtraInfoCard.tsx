import {IStation} from "./Dashboard.tsx";
import "./styles/ExtraInfoCard.css"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
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
                        <Card className="bg-[#393E46] text-[#EEEEEE] shadow-gray-400 shadow-lg rounded-3xl p-4"
                              style={{
                                  height: "45vh",
                                  overflow: "auto",
                                  width: "28vw",
                              }}>
                            <CardHeader>
                                <CardTitle>
                                    Willkommen im Guide-Modus!
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
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

                        <Card className="bg-[#393E46] text-[#EEEEEE] shadow-gray-400 shadow-lg rounded-3xl p-4"
                              style={{
                                  height: "45vh",
                                  overflow: "auto",
                                  width: "28vw",
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
                <Card className="bg-[#393E46] text-[#EEEEEE] shadow-gray-400 shadow-lg rounded-3xl p-4"
                      style={{
                          height: "45vh",
                          overflow: "auto",
                          width: "28vw",
                      }}>
                    <CardHeader>
                        <CardTitle>
                            Willkommen bei Neckarstadt KliMA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p style={{fontSize: "1.8vh"}}>Dieses Dashboard visualisiert die Temperaturwerte einiger
                            Messstationen der Neckarstadt West. Die sichtbaren Werte sind Durchschnittstemperaturen um 6
                            Uhr morgens.
                        </p>
                        <p style={{fontSize: "1.8vh"}}>Wähle eine Station aus, um mehr über sie zu erfahren oder
                            mehrere, um diese zu vergleichen.
                        </p>
                        <p style={{fontSize: "1.8vh"}}> Achte gerne auf die Entfernung der Stationen zu Grünflächen bzw.
                            Wohngebieten, fällt dir etwas auf?
                        </p>
                        <br/>
                        <p style={{fontSize: "1.8vh"}}> Du kannst dir auch gerne eine geführte Data-Story im Guide-Modus
                            auswählen.
                        </p>
                        <p style={{fontSize: "1.8vh"}}> Viel Spaß!</p>
                    </CardContent>
                </Card>
            )}

        </div>
    )

}
