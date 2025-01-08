export interface PredictionItem {
    Category: string;
    Item: string;
    Type_of_Order: 'Dining' | 'Takeaway';
    Predicted_Orders: number;
    Date: string;
}

export interface PredictionResponse {
    predictions: PredictionItem[];
    total_orders: number;
    area: string;
    date_range: {
        start_date: string;
        end_date: string;
    };
    daily_totals: {
        [key: string]: number;
    };
}