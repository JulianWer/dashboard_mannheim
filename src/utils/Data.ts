// TODO with tanstackQuery

import {useQuery} from "@tanstack/react-query";

export const useGetDevices = (apiKey: string) => {
    return useQuery({
        queryKey: ["data"],
        queryFn: async () => {
            return await fetch("https://api.mvvsmartcities.com/v3/device", {
                headers: {
                    'accept': 'application/json',
                    'Ocp-Apim-Subscription-Key': apiKey
                }
            }).then((res) => res.json())
        },
    })
}
