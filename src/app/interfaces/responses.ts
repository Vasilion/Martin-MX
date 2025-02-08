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

const TEST = 'http://localhost:1337/api/martin-open-practice-spots';
const API_URL =
    'https://strapi-production-e880.up.railway.app/api/martin-open-practice-spots';

export const CLASSES = {
    C: {
        formLink: 'https://buy.stripe.com/test_cN25kB7zBbIq1aM28c',
        strapiEndpoint: `${TEST}/C`,
        name: 'C'
    },
    MINI: {
        formLink: 'https://buy.stripe.com/test_4gweVb0798we7za7sv',
        strapiEndpoint: `${TEST}/MINI`,
        name: 'Mini'
    },
    AB: {
        formLink: 'https://buy.stripe.com/test_cN2dR7f237sa8De4gi',
        strapiEndpoint: `${TEST}/AB`,
        name: 'AB'
    }
} as const;

export type ClassType = keyof typeof CLASSES;

export interface StripeResponse {
    sessionId: string;
    url: string;
}

export interface PaymentSuccessData {
    sessionId: string;
    formId: string;
    timestamp: number;
}

export interface PracticeSpotsLeft {
    class: string;
    spotsLeft: number;
}
