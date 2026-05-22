import { Company } from "./company.js";
import { Invoice_position } from "./invoice_position.js";

export type Invoice = {
    customId: string;
    profileId: string;
    id: string;
    issueDate: string;
    dueDate: string;
    invoiceTypeCode: number;
    currencyCode: string;
    supplierParty: Company;
    customerParty: Company;
    deliveryDate: string;
    paymentMeansCode: string;
    totalAmount: number;
    totalTax: number;
    taxableAmount: number;
    prepaidAmount: number;
    taxCategory_id: string;
    taxCategory_percent: number;
    taxCategory_scheme: string;
    positions: [Invoice_position];
}