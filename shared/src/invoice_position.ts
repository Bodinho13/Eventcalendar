export type Invoice_position = {
    invoice_id: string;
    pos_id: number;
    description: string;
    item_id: number;
    price: number;
    tax_id: string;
    tax_rate: number;
    tax_scheme: string;
    currency_code: string;
    quantity: number;
}