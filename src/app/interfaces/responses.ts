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
        formLink: 'https://buy.stripe.com/8wM5ks24ca9D1gc6oq',
        strapiEndpoint: `${API_URL}/C`,
        name: 'C'
    },
    MINI: {
        formLink: 'https://buy.stripe.com/dR66ow108a9Df72eUX',
        strapiEndpoint: `${API_URL}/MINI`,
        name: 'MINI'
    },
    AB: {
        formLink: 'https://buy.stripe.com/fZecMUbEM81vcYU7sw',
        strapiEndpoint: `${API_URL}/AB`,
        name: 'A/B'
    },
    JR: {
        formLink: 'https://buy.stripe.com/fZe5ks1085Tn9MI9AF',
        strapiEndpoint: `${TEST}/JR`,
        name: 'Jr Track'
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
