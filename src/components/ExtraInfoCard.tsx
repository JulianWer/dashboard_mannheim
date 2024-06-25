import "./styles/ExtraInfoCard.css"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

interface IExtraInfoCard {
    isInGuidedMode: boolean;
    selectedDataStory: number
    setSelectedDataStory: React.Dispatch<React.SetStateAction<number>>
}

export default function ExtraInfoCard(props: IExtraInfoCard) {
    const {isInGuidedMode, setSelectedDataStory, selectedDataStory} = props;
    return (
        <div>
            <div>
                {isInGuidedMode ? (
                    <Card className="bg-[#393E46] text-[#EEEEEE] shadow-gray-400 shadow-lg rounded-3xl p-4"
                          style={{
                              height: "45vh",
                              overflow: "auto",
                              width: "28vw",
                          }}>
                        <CardHeader>
                            <div className="flex items-center pb-6
 justify-center space-x-4">
                                <Button
                                    className={` ${selectedDataStory === 1 ? 'bg-[#00ADB5] text-white hover:bg-[#00ADB5]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                                    type="button"
                                    onClick={() => {
                                        setSelectedDataStory(1)
                                    }}
                                >
                                    Data Story 1
                                </Button>
                                <Button
                                    className={` ${selectedDataStory === 2 ? 'bg-[#00ADB5] text-white hover:bg-[#00ADB5]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                                    type="button"
                                    onClick={() => {
                                        setSelectedDataStory(2)
                                    }}
                                >
                                    Data Story 2
                                </Button>
                                <Button
                                    className={` ${selectedDataStory === 3 ? 'bg-[#00ADB5] text-white hover:bg-[#00ADB5]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                                    type="button"
                                    onClick={() => {
                                        setSelectedDataStory(3)
                                    }}
                                >
                                    Data Story 3
                                </Button>
                            </div>
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
                        <CardHeader>
                            <CardTitle>
                                Willkommen bei Neckarstadt KliMA
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p style={{fontSize: "1.8vh"}}>Dieses Dashboard visualisiert die Temperaturwerte einiger
                                Messstationen der Neckarstadt West. Die sichtbaren Werte sind Durchschnittstemperaturen
                                um 6
                                Uhr morgens.
                            </p>
                            <p style={{fontSize: "1.8vh"}}>Wähle eine Station aus, um mehr über sie zu erfahren oder
                                mehrere, um diese zu vergleichen.
                            </p>
                            <p style={{fontSize: "1.8vh"}}> Achte gerne auf die Entfernung der Stationen zu Grünflächen
                                bzw.
                                Wohngebieten, fällt dir etwas auf?
                            </p>
                            <br/>
                            <p style={{fontSize: "1.8vh"}}> Du kannst dir auch gerne eine geführte Data-Story im
                                Guide-Modus
                                auswählen.
                            </p>
                            <p style={{fontSize: "1.8vh"}}> Viel Spaß!</p>
                        </CardContent>
                    </Card>
                )}
            </div>

        </div>
    )

}
