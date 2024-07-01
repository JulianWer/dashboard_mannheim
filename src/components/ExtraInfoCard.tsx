import "./styles/ExtraInfoCard.css"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

interface IExtraInfoCard {
    isInGuidedMode: boolean;
    selectedDataStory: number
    setSelectedDataStory: React.Dispatch<React.SetStateAction<number>>
    handleGuideMode: (storyNumber: number) => void; 
}

export default function ExtraInfoCard(props: IExtraInfoCard) {
    const {isInGuidedMode, setSelectedDataStory, selectedDataStory, handleGuideMode} = props;
    return (
        <div>
            <div>
                {isInGuidedMode ? (
                    <Card className="bg-white text-[#393E46]  shadow-gray-400 shadow-lg p-2 pb-0"
                          style={{
                              height: "45vh",
                              overflow: "auto",
                              width: "28vw",
                          }}>
                        <CardHeader className="p-0">
                            <div className="flex items-center pb-2 pt-2 justify-center space-x-4">
                                <Button
                                    className={` ${selectedDataStory === 1 ? 'bg-[#3572EF] text-white hover:bg-[#3572EF]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                                    type="button"
                                    onClick={() => {
                                        setSelectedDataStory(1)
                                        handleGuideMode(1)
                                    }}
                                >
                                    Data Story 1
                                </Button>
                                <Button
                                    className={` ${selectedDataStory === 2 ? 'bg-[#3572EF] text-white hover:bg-[#3572EF]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                                    type="button"
                                    onClick={() => {
                                        setSelectedDataStory(2)
                                        handleGuideMode(2)
                                    }}
                                >
                                    Data Story 2
                                </Button>
                                <Button
                                    className={` ${selectedDataStory === 3 ? 'bg-[#3572EF] text-white hover:bg-[#3572EF]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                                    type="button"
                                    onClick={() => {
                                        setSelectedDataStory(3)
                                        handleGuideMode(3)
                                    }}
                                >
                                    Data Story 3
                                </Button>
                            </div>
                            <CardTitle className="pl-6 pb-6">
                                Willkommen im Guide-Modus!
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                        {selectedDataStory === 1 && <>
                            <p className="justified-text" style={{fontSize: "1.5vh"}}>Die für dich ausgewählten Stationen
                                befinden sich alle
                                auf
                                der Max-Joseph-Straße. Wie dir vielleicht bereits aufgefallen ist, nimmt die
                                Temperatur
                                von Station zu Station ab, umso weiter wir uns von der alten Feuerwache entfernen.
                                Der
                                Temperaturunterschied zu diesem Zeitpunkt zwischen der ersten und letzten Station
                                auf
                                dieser Straße beträgt ganze 5 Grad. </p>
                                <br/>

                            <p className="justified-text" style={{fontSize: "1.5vh"}}>Außerdem interessant ist, dass wir uns
                                im Verlauf der
                                Max-Joseph-Straße immer weiter dem Herzogenriedpark annähern. Dieser Park stellt mit
                                seiner überdurchschnittlich hohen Begrünung und sehr geringen Versiegelung eine
                                natürliche Abkühlungszone dar, die sich positiv auf ihre Umgebung auswirkt.</p>
                                <br/>

                            <p className="justified-text" style={{fontSize: "1.5vh"}}>Erkunde gerne noch weitere Data-Stories 
                                und die dazu gehörigen Visualisierungen oder kehre in den Explore-Modus zurück.</p></>}

                                {selectedDataStory === 2 && <>
                            <p className="justified-text" style={{fontSize: "1.5vh"}}>In dieser Data-Story wird ebenfalls
                                der Morgen des 07.04.2024 betrachtet. Die für dich ausgewählten Stationen wurden anhand
                                ihres Standorts gruppiert. </p>
                                <br/>

                            <p className="justified-text" style={{fontSize: "1.5vh"}}>Die erste Gruppe der Stationen befindet
                                sich an der alten Feuerwache. Die vier ausgewählten Stationen befinden sich alle in den Top 6
                                der heißesten Stationen der Neckarstadt an diesem Morgen.
                            </p>
                                <br/>

                            <p className="justified-text" style={{fontSize: "1.5vh"}}>Auf der anderen Seite wurden die Stationen in der Nähe des Herzogenriedparks
                                gruppiert. Diese fünf Stationen wiederum befinden sich alle in den Top 6 der kühlsten Stationen der Neckarstadt. </p></>}

                                {selectedDataStory === 3 && <>
                            <p className="justified-text" style={{fontSize: "1.5vh"}}>Hier könnte ihre Werbung stehen </p>
                                <br/>

                            <p className="justified-text" style={{fontSize: "1.5vh"}}>Hier ist halt abnormal, dass die Temperatur von 24 Uhr bis 9 Uhr morgens quasi gleich bleibt. Auch die Werte allgemein sind sehr nahe beieinander und die heißesten Stationen sind beim neuen Messplatz (da war vom 27.04 bis 12.05 die Maimesse. Der betrachtete Tag ist der 05.05 also zu dieser Zeit) 
                                
                            </p>
                                <br/>

                            <p className="justified-text" style={{fontSize: "1.5vh"}}>Außerdem war es die Nacht von Samstag auf Sonntag wo vermutlich viele Leute dort waren
                            </p></>}
                        </CardContent>
                    </Card>

                ) : (
                    <Card className="bg-white text-[#393E46] shadow-gray-400 shadow-lg p-2 pb-0"
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
                            <p className="justified-text" style={{fontSize: "1.8vh"}}>Dieses Dashboard visualisiert die Temperaturwerte einiger
                                Messstationen der Neckarstadt West. Die sichtbaren Werte sind Durchschnittstemperaturen
                                um 6
                                Uhr morgens.
                            </p>
                            <br/>
                            <p className="justified-text" style={{fontSize: "1.8vh"}}>Wähle eine Station aus, um mehr über sie zu erfahren oder
                                mehrere, um diese zu vergleichen.
                            </p>
                            <br/>
                            <p className="justified-text" style={{fontSize: "1.8vh"}}> Achte gerne auf die Entfernung der Stationen zu Grünflächen
                                bzw.
                                Wohngebieten, fällt dir etwas auf?
                            </p>
                            <br/>
                            <p className="justified-text" style={{fontSize: "1.8vh"}}> Du kannst dir auch gerne eine geführte Data-Story im
                                Guide-Modus
                                auswählen.
                            </p>
                            <br/>
                            <p style={{fontSize: "1.8vh"}}> Viel Spaß!</p>
                        </CardContent>
                    </Card>
                )}
            </div>

        </div>
    )

}
