import {Circle, MapContainer, TileLayer, Tooltip} from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import {useGetDevices} from "../utils/Data.ts";
import {LatLngTuple} from "leaflet";
import classes from "./styles/LeafletMap.module.css";

interface ICoordinates {
    coordinates: [number, number];
    type: string;
}

interface IDevice {
    customProperties: {
        internalName: string;
    };
    description: string;
    deviceId: string;
    deviceType: string;
    isAliveThresholdCritical: number;
    isAliveThresholdWarn: number;
    isEnabled: boolean;
    keys: unknown[];
    location: ICoordinates;
    name: string;
    refDeviceGroup: string;
    tags: string[];
    transmissionInterval: number;
}
export function LeafletMap() {
    const apiKey = "" // Add your API key here
    const coordinates : LatLngTuple = [49.488888, 8.469167]
    const { data: data } = useGetDevices(apiKey)
    console.log("=>(LeafletMap.tsx:34) data", data);
    const validDeviceLocation = data ? (data as IDevice[]).filter((d)=> d.location !== undefined && d.location.coordinates[0] !== null && d.location.coordinates[1] !== null):undefined
    console.log("=>(LeafletMap.tsx:36) validDeviceLocation", validDeviceLocation);



    return (
        <div>
            <MapContainer
                center={coordinates}
                zoom={13}
                className={classes.mapContainer}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <svg>
                    <g fill="white" stroke="currentColor" strokeWidth="1.5">
                        {validDeviceLocation && validDeviceLocation.map((d, i) => (
                            <Circle
                                key={i}
                                center={[d.location.coordinates[1], d.location.coordinates[0]]}
                                pathOptions={{ color: "purple", fillColor: "purple", fillOpacity: 0.2 }}
                                radius={30}  >
                                <Tooltip>
                                    <div>
                                        Name: {d.name}<br />
                                        Typ: {d.deviceType}<br />
                                        Coordinates:<br />
                                        latitude: {d.location.coordinates[1]}<br />
                                        longitude: {d.location.coordinates[0]}
                                    </div>
                                </Tooltip>
                            </Circle>
                        ))
                        }
                    </g>
                </svg>
            </MapContainer>
        </div>
    );
}
