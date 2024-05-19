import "./App.css";


import "leaflet/dist/leaflet.css";
import {LeafletMap} from "./components/LeafletMap.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import ScatterplotIris from "./components/ScatterplotIris.tsx";

export function App() {
    const queryClient = new QueryClient();
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <LeafletMap/>
                <ScatterplotIris/>
            </QueryClientProvider>
        </>
    );
}
