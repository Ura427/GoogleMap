import { Timestamp } from "firebase/firestore"




export interface Location {
    Lat: number,
    Long: number
}

export interface MarkerData {
    id: string,
    Location: Location,
    Timestamp: Timestamp,
    Next: string | null
}