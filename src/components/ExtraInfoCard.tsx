import "./styles/ExtraInfoCard.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";

interface IExtraInfoCard {
    isInGuidedMode: boolean;
    selectedDataStory: number
    setSelectedDataStory: React.Dispatch<React.SetStateAction<number>>
    handleGuideMode: (storyNumber: number) => void;
}

export default function ExtraInfoCard(props: IExtraInfoCard) {
    const { isInGuidedMode, setSelectedDataStory, selectedDataStory, handleGuideMode } = props;
    return (
        <div>
            <div>
                {isInGuidedMode ? (
                    <Card className="bg-white text-[#393E46] shadow-gray-400 shadow-lg"
                        style={{
                            height: "50vh",
                            overflow: "auto",
                            width: "30vw",
                            padding: "1.5vh 1.5vw 1.5vh 1.5vw"
                        }}>
                        <CardHeader className="p-0">
                            <div className="flex items-center justify-center space-x-4">
                                <Button
                                    style={{ fontSize: "1.8vh", width: "8vw", height: "3vh" }}
                                    className={` ${selectedDataStory === 1 ? 'bg-[#3572EF] text-white hover:bg-[#3572EF]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                                    type="button"
                                    variant={"outline"}
                                    onClick={() => {
                                        setSelectedDataStory(1)
                                        handleGuideMode(1)
                                    }}
                                >
                                    Data Story 1
                                </Button>
                                <Button
                                    style={{ fontSize: "1.8vh", width: "8vw", height: "3vh" }}
                                    className={` ${selectedDataStory === 2 ? 'bg-[#3572EF] text-white hover:bg-[#3572EF]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                                    type="button"
                                    variant={"outline"}
                                    onClick={() => {
                                        setSelectedDataStory(2)
                                        handleGuideMode(2)
                                    }}
                                >
                                    Data Story 2
                                </Button>
                                <Button
                                    style={{ fontSize: "1.8vh", width: "8vw", height: "3vh" }}
                                    className={` ${selectedDataStory === 3 ? 'bg-[#3572EF] text-white hover:bg-[#3572EF]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                                    type="button"
                                    variant={"outline"}
                                    onClick={() => {
                                        setSelectedDataStory(3)
                                        handleGuideMode(3)
                                    }}
                                >
                                    Data Story 3
                                </Button>
                            </div>
                            <CardTitle style={{ fontSize: "2vh", padding: "1.5vh 0vw 1vh 0vw" }}>
                                Willkommen im Guide-Modus!
                            </CardTitle>
                        </CardHeader>
                        <CardContent style={{ padding: "1.5vh 0vw 0vh 0vw" }}>
                            {selectedDataStory === 1 && <>
                                <p className="justified-text" style={{ fontSize: "1.5vh" }}>Die für dich ausgewählten Stationen
                                    befinden sich alle
                                    auf
                                    der Max-Joseph-Straße. Wie dir vielleicht bereits aufgefallen ist, nimmt die
                                    Temperatur
                                    von Station zu Station ab, umso weiter wir uns von der alten Feuerwache entfernen.
                                    Der
                                    Temperaturunterschied zu diesem Zeitpunkt zwischen der ersten und letzten Station
                                    auf
                                    dieser Straße beträgt ganze 5 Grad. </p>
                                <br />

                                <p className="justified-text" style={{ fontSize: "1.5vh" }}>Außerdem interessant ist, dass wir uns
                                    im Verlauf der
                                    Max-Joseph-Straße immer weiter dem Herzogenriedpark annähern. Dieser Park stellt mit
                                    seiner überdurchschnittlich hohen Begrünung und sehr geringen Versiegelung eine
                                    natürliche Abkühlungszone dar, die sich positiv auf ihre Umgebung auswirkt.</p>
                                <br />

                                <p className="justified-text" style={{ fontSize: "1.5vh" }}>Erkunde gerne noch weitere Data-Stories
                                    und die dazu gehörigen Visualisierungen oder kehre in den Explore-Modus zurück.</p></>}

                            {selectedDataStory === 2 && <>
                                <p className="justified-text" style={{ fontSize: "1.5vh" }}>In dieser Data-Story wird ebenfalls
                                    der Morgen des 07.04.2024 betrachtet. Die für dich ausgewählten Stationen wurden anhand
                                    ihres Standorts gruppiert. </p>
                                <br />

                                <p className="justified-text" style={{ fontSize: "1.5vh" }}>Die erste Gruppe der Stationen befindet
                                    sich an der alten Feuerwache. Die vier ausgewählten Stationen befinden sich alle in den Top 6
                                    der heißesten Stationen der Neckarstadt an diesem Morgen.
                                </p>
                                <br />

                                <p className="justified-text" style={{ fontSize: "1.5vh" }}>Auf der anderen Seite wurden die Stationen in der Nähe des Herzogenriedparks
                                    gruppiert. Diese fünf Stationen wiederum befinden sich alle in den Top 6 der kühlsten Stationen der Neckarstadt. </p></>}

                            {selectedDataStory === 3 && <>
                                <p className="justified-text" style={{ fontSize: "1.5vh" }}>Hier könnte ihre Werbung stehen </p>
                                <br />

                                <p className="justified-text" style={{ fontSize: "1.5vh" }}>Hier ist halt abnormal, dass die Temperatur von 24 Uhr bis 9 Uhr morgens quasi gleich bleibt. Auch die Werte allgemein sind sehr nahe beieinander und die heißesten Stationen sind beim neuen Messplatz (da war vom 27.04 bis 12.05 die Maimesse. Der betrachtete Tag ist der 05.05 also zu dieser Zeit)

                                </p>
                                <br />

                                <p className="justified-text" style={{ fontSize: "1.5vh" }}>Außerdem war es die Nacht von Samstag auf Sonntag wo vermutlich viele Leute dort waren
                                </p></>}
                        </CardContent>
                    </Card>

                ) : (
                    <Card className="bg-white text-[#393E46] shadow-gray-400 shadow-lg"
                        style={{
                            height: "50vh",
                            overflow: "auto",
                            width: "30vw",
                        }}>
                        <CardHeader style={{ padding: "1.5vh 1.5vw 1.5vh 1.5vw" }}>
                            <CardTitle style={{ fontSize: "2vh" }}>
                                Wie wirkt sich Flächenversiegelung auf das Klima Mannheims aus?
                            </CardTitle>
                        </CardHeader>
                        <CardContent style={{ padding: "1.5vh 1.5vw 1.5vh 1.5vw" }}>
                            <p className="justified-text" style={{ fontSize: "1.6vh" }}>Diese Frage soll am Beispiel der Neckarstadt mithilfe von datengestützten Visualisierungen beantwortet werden.
                                Das Liniendiagramm zeigt den Temperaturverlauf über Nacht in einem 24 Stunden Zeitraum, das Balkendiagramm wiederum zeigt für die selben Stationen die Messwerte nach der nächtlichen Abkühlung zwischen 5:30 und 6:30 Uhr.
                            </p>
                            <br />
                            <p className="justified-text" style={{ fontSize: "1.6vh" }}>Wähle eine Station aus, um mehr über sie zu erfahren oder mehrere, um diese zu vergleichen.
                            </p>
                            <br />
                            <p className="justified-text" style={{ fontSize: "1.6vh" }}> Achte gerne auf die Entfernung der Stationen zu Grünflächen bzw. Wohngebieten, fällt dir etwas auf?
                            </p>
                            <br />
                            <p className="justified-text" style={{ fontSize: "1.6vh" }}> Falls du mit deiner offenen Erkundung fertig bist, kannst du dir auch die geführten Data-Stories im Guide-Modus anschauen.
                            </p>
                            <br />
                            <p style={{ fontSize: "1.6vh" }}> Viel Spaß!</p>
                        </CardContent>
                    </Card>
                )}
            </div>

        </div>
    )

}
