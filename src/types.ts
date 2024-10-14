export type Event = {
    name: string; // Title or name of the event
    startDate: string; // Start date in ISO 8601 format
    endDate?: string; // End date in ISO 8601 format (optional)
    location?: string; // Location of the event (e.g. New York, USA)
    color?: string; // Color associated with the event (e.g. hex code)
    url?: string; // Optional URL for more information about the event
    image?: string; // Optional image URL related to the event
    keywords?: string[]; // Optional keywords associated with the event
    ongoing?: boolean; // Optional flag to indicate if the event is ongoing
};

export type Death = {
    name: string;
    daysLived: number;
    color?: string
}

export type Subject = {
    name: string;
    birthdate: string;
    lifeExpectancy?: number;
};