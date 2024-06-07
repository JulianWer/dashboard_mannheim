import * as d3 from "d3";

export default function getStationData() {
    return d3.csv("/public/data.csv").then(function(data) {
        // Filtern der Daten nach dem gewünschten Tag
        const filteredData = data.filter(d => {
        // Überprüfung, ob der Zeitstempel das erwartete Format hat (YYYY-MM-DDTHH:MM:SSZ)
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(d.timestamps)) {
            // Parsen des Zeitstempels
            const timestamp = new Date(d.timestamps);
            const desiredDate = "2024-04-07";
            const desiredBeginning = new Date(desiredDate + "T03:30:00Z");
            const desiredEnd = new Date(desiredDate + "T04:30:00Z");
            return timestamp.toISOString().slice(0, 10) === desiredDate && timestamp.getTime() >= desiredBeginning.getTime() && timestamp.getTime() <= desiredEnd.getTime();
        }
    });
    
    // Gruppieren der Daten nach Messstationen
    const stationData = {};
    filteredData.forEach(d => {
        const stationName = `${d.Messnetz}-${d.StationsID}-${d.StationsIDErgänzung}`;
        if (!stationData[stationName]) {
            stationData[stationName] = [];
        }
        stationData[stationName].push(parseFloat(d.temperature)); 
    });
    
    // Bestimmen der durchschnittlichen Temperatur jeder Station von 3:30 bis 4:30
    const averageTemperatures = {};
    Object.keys(stationData).forEach(station => {
        const validTemperatures = stationData[station].filter(temperature => temperature !== -999);
        const sumTemperatures = validTemperatures.reduce((sum, temperature) => sum + temperature, 0);
        const averageTemperature = sumTemperatures / validTemperatures.length;
    averageTemperatures[station] = averageTemperature;
    });
    
    return averageTemperatures;
    });
  }