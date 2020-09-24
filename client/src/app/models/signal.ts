export interface Signal {
    _id: number;
    currency: string;
    commodity: string;
    price: number;
    percent: number;
    close_price: number;
    current_price: number;
    creation_date: Date;
    close_date: Date;
    status: string;
    time: string;
    price_history: any;
    description: string;
    iconUrl: string;
    courseListIcon: string;
    longDescription: string;
}
