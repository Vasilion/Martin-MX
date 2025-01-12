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

export interface Sponsor {
    name: string;
    photo?: string;
    link?: string;
    isActive?: boolean;
    isTitle?: boolean;
}
