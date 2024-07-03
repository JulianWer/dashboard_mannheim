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
                                    style={{ fontSize: "1.6vh", width: "8vw", height: "3vh" }}
                                    className={` ${selectedDataStory === 1 ? 'bg-[#3572EF] text-white hover:bg-[#3572EF]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                                    type="button"
                                    onClick={() => {
                                        setSelectedDataStory(1)
                                        handleGuideMode(1)
                                    }}
                                >
                                    Data-Story 1
                                </Button>
                                <Button
                                    style={{ fontSize: "1.6vh", width: "8vw", height: "3vh" }}
                                    className={` ${selectedDataStory === 2 ? 'bg-[#3572EF] text-white hover:bg-[#3572EF]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                                    type="button"
                                    onClick={() => {
                                        setSelectedDataStory(2)
                                        handleGuideMode(2)
                                    }}
                                >
                                    Data-Story 2
                                </Button>
                                <Button
                                    style={{ fontSize: "1.6vh", width: "8vw", height: "3vh" }}
                                    className={` ${selectedDataStory === 3 ? 'bg-[#3572EF] text-white hover:bg-[#3572EF]' : 'bg-white text-black hover:bg-gray-200 text-black'} focus:outline-none`}
                                    type="button"
                                    onClick={() => {
                                        setSelectedDataStory(3)
                                        handleGuideMode(3)
                                    }}
                                >
                                    Data-Story 3
                                </Button>
                            </div>
                            {selectedDataStory === 1 && <CardTitle style={{ fontSize: "2vh", padding: "1.5vh 0vw 1vh 0vw" }}>
                                Temperaturverlauf entlang der Max-Joseph-Straße
                            </CardTitle>}
                            {selectedDataStory === 2 && <CardTitle style={{ fontSize: "2vh", padding: "1.5vh 0vw 1vh 0vw" }}>
                                Alte Feuerwache versus Herzogenriedpark
                            </CardTitle>}
                            {selectedDataStory === 3 && <CardTitle style={{ fontSize: "2vh", padding: "1.5vh 0vw 1vh 0vw" }}>
                                Mannheimer Maimess und ihre Auswirkungen
                            </CardTitle>}
                        </CardHeader>
                        <CardContent style={{ padding: "1.5vh 0vw 0vh 0vw" }}>
                            {selectedDataStory === 1 && <>
                                <p className="justified-text" style={{ fontSize: "1.5vh", paddingBottom: "1vh" }}>Die für dich ausgewählten Stationen
                                    befinden sich alle
                                    auf
                                    der Max-Joseph-Straße. Wie dir vielleicht bereits aufgefallen ist, nimmt die
                                    Temperatur
                                    von Station zu Station ab, umso weiter wir uns von der alten Feuerwache entfernen.
                                    Der
                                    Temperaturunterschied zu diesem Zeitpunkt zwischen der ersten und letzten Station
                                    auf
                                    dieser Straße beträgt ganze 5 Grad. </p>
                                <p className="justified-text" style={{ fontSize: "1.5vh", paddingBottom: "1vh" }}>Außerdem interessant ist, dass wir uns
                                    im Verlauf der
                                    Max-Joseph-Straße immer weiter dem Herzogenriedpark annähern. Dieser Park stellt mit
                                    seiner überdurchschnittlich hohen Begrünung und sehr geringen Versiegelung eine
                                    natürliche Abkühlungszone dar, die sich positiv auf ihre Umgebung auswirkt.</p>
                                <p className="justified-text" style={{ fontSize: "1.5vh", paddingBottom: "1vh" }}>Erkunde gerne noch weitere Data-Stories
                                    und die dazu gehörigen Visualisierungen oder kehre in den Explore-Modus zurück.</p></>}

                            {selectedDataStory === 2 && <>
                                <p className="justified-text" style={{ fontSize: "1.5vh", paddingBottom: "1vh" }}>Gruppiert man die Messstationen nach ihrem Standort und stellt die Temperaturwerte an der Alten Feuerwache mit denen am Herzogenriedpark gegenüber, wird schnell ein Muster erkennbar.</p>

                                 <p className="justified-text" style={{ fontSize: "1.5vh", paddingBottom: "1vh" }}>Die Temperaturen an der alten Feuerwache befinden
                                    sich alle innerhalb der heißesten sechs Messwerte der Neckarstadt an diesem Morgen.
                                </p>
                                <p className="justified-text" style={{ fontSize: "1.5vh", paddingBottom: "1vh" }}>Auf der anderen Seite liegen die Temperaturwerte in der Nähe des Herzogenriedparks
                                    alle innerhalb den kühlsten sechs Messwerte der Neckarstadt.
                                </p>
                                <p className="justified-text" style={{ fontSize: "1.5vh", paddingBottom: "1vh" }}>
                                    Dieses Muster ist an vielen Tagen zu erkennen. Für diese Data-Story wurde, analog zu Data-Story 1, der Morgen nach dem heißesten, jemals in Mannheim aufgezeichneten, sechsten April ausgewählt.</p>
                               </>}

                            {selectedDataStory === 3 && <>
                                <p className="justified-text" style={{ fontSize: "1.5vh", paddingBottom: "1vh" }}>
                                    Die letzte Data-Story soll veranschaulichen, dass die Temperatur sehr komplex ist und sich von vielen, teils unerwarteten Faktoren, beeinflussen lässt.
                                     </p>
                                <p className="justified-text" style={{ fontSize: "1.5vh", paddingBottom: "1vh" }}>
                                    Am betrachteten Sonntagmorgen des 05. Mai liegen die Temperaturwerte ziemlich nahe beieinander. Es ist jedoch auffällig, dass die Temperaturwerte um den Neuen Messplatz unerwartet hoch ausfallen.
                                    Hier fand vom 27. April bis zum 12. Mai die Mannheimer Maimess statt. Eine Samstagnacht mit vielen Menschen, einer Menge Attraktionen und vielen Ständen.
                                </p>
                                <p className="justified-text" style={{ fontSize: "1.5vh" }}>
                                    Dies impliziert jedoch noch keine Kausalität sondern dient lediglich dazu, zu veranschaulichen, dass es sehr schwer ist die genauen Gründe für den Temperaturverlauf herauszufinden.
                                    In weiteren GDV-Projekten müsste unsere Forschungsfrage, unter Berücksichtigung anderer Faktoren wie bspw. Niederschlag, Wind oder externe Ereignisse, genauer beläuchet werden</p></>}
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
                            <p className="justified-text" style={{ fontSize: "1.6vh", paddingBottom: "1vh" }}>Diese Frage soll am Beispiel der Neckarstadt mithilfe von datengestützten Visualisierungen beantwortet werden.
                                Das Liniendiagramm zeigt den Temperaturverlauf über Nacht in einem 24 Stunden Zeitraum, das Balkendiagramm wiederum zeigt für die selben Stationen die Messwerte nach der nächtlichen Abkühlung zwischen 5:30 und 6:30 Uhr.
                            </p>
                            <p className="justified-text" style={{ fontSize: "1.6vh", paddingBottom: "1vh" }}>Wähle eine Station aus, um mehr über sie zu erfahren oder mehrere, um diese zu vergleichen.
                            </p>
                            <p className="justified-text" style={{ fontSize: "1.6vh", paddingBottom: "1vh" }}> Achte gerne auf die Entfernung der Stationen zu Grünflächen bzw. Wohngebieten, fällt dir etwas auf?
                            </p>
                            <p className="justified-text" style={{ fontSize: "1.6vh", paddingBottom: "1vh" }}> Falls du mit deiner offenen Erkundung fertig bist, kannst du dir auch die geführten Data-Stories im Guide-Modus anschauen.
                            </p>
                            <p style={{ fontSize: "1.6vh" }}> Viel Spaß!</p>
                        </CardContent>
                    </Card>
                )}
            </div>

        </div>
    )

}
