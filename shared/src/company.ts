import { Person } from "./person.js";

export type Company = {
    id: string;
    name: string;
    endpointId: string;
    streetName: string;
    cityName: string;
    postalZone: string;
    countryCode: string;
    tax_vat: string;
    tax_fc: string;
    legalEntity_name: string;
    contact: Person;
    financeAccount_id: string;
    financeAccount_name: string;
}