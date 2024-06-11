import "./App.css";


import "leaflet/dist/leaflet.css";
//import {LeafletMap} from "./components/LeafletMap.tsx";
import {LeafletMap} from "./components/LeafletMapTemperatur.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import BarChart from "./components/BarChart.tsx";
import LineChart from "./components/LineChart.tsx";

export function App() {
    const queryClient = new QueryClient();
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <LeafletMap/>
                <BarChart/>
                <LineChart />
            </QueryClientProvider>
        </>
    );
}
