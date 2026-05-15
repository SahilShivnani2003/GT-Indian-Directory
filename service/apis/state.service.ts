import { publicClient } from "../apiClient";

export const stateService = {
    getStates: (countryCode: string) => publicClient.get(`/State/states/${countryCode}`)
}