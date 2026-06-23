import { publicClient } from "../apiClient";

export const stateService = {
    getStates: (countryCode: string) => publicClient.get(`/StateCity/states/${countryCode}`),
    getCities: (stateCode: string) => publicClient.get(`/StateCity/states/${stateCode}`)
}