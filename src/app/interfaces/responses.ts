export interface Event {
    name: string;
    startDate: string;
    endDate: string;
    description: string;
    image: Image;
}

export interface Image {
    data: {
        attributes: {
            url: string;
        };
    };
}
