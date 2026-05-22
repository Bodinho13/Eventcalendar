import { formatDateDB } from "./useCalendar";
import type { Invoice } from "../../shared/src/invoice";
import type { Company } from "../../shared/src/company";

const xmlDoc = document.implementation.createDocument(null, "xRechnung_" + formatDateDB(new Date()));

const createXRechnung = (rechnung: Invoice): XMLDocument => {
    
    const invoiceElem = xmlDoc.createElement("Invoice");
    invoiceElem.setAttribute("xmlns", "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2");
    invoiceElem.setAttribute("xmlns:cac", "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2");
    invoiceElem.setAttribute("xmlns:cec", "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2");
    invoiceElem.setAttribute("xmlns:cbc", "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2");

    let elem = xmlDoc.createElement("cbc:CustomizationID");
    elem.innerHTML = rechnung.customId;
    invoiceElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:ProfileID");
    elem.innerHTML = rechnung.profileId;
    invoiceElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:ID");
    elem.innerHTML = rechnung.id;
    invoiceElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:IssueDate");
    elem.innerHTML = rechnung.issueDate;
    invoiceElem.appendChild(elem);
    
    elem = xmlDoc.createElement("cbc:DueDate");
    elem.innerHTML = rechnung.dueDate;
    invoiceElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:InvoiceTypeCode");
    elem.innerHTML = rechnung.invoiceTypeCode.toString();
    invoiceElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:DocumentCurrencyCode");
    elem.innerHTML = rechnung.currencyCode;
    invoiceElem.appendChild(elem);

    var supplierPartyElem = xmlDoc.createElement("cac:AccountingSupplierParty");
    supplierPartyElem.appendChild(createPartyXml(rechnung.supplierParty));
    invoiceElem.appendChild(supplierPartyElem);

    var customerPartyElem = xmlDoc.createElement("cac:AccountingCustomerParty");
    customerPartyElem.appendChild(createPartyXml(rechnung.customerParty));
    invoiceElem.appendChild(customerPartyElem);

    //Delivery Info
    var deliveryElem = xmlDoc.createElement("cac:Delivery");
    elem = xmlDoc.createElement("cbc:ActualDeliveryDate");
    elem.innerHTML = rechnung.deliveryDate;
    deliveryElem.appendChild(elem);
    invoiceElem.appendChild(deliveryElem);

    //Payment
    var paymentElem = xmlDoc.createElement("cac:PaymentMeans");
    elem = xmlDoc.createElement("cbc:PaymentMeansCode");
    elem.innerHTML = rechnung.paymentMeansCode;
    paymentElem.appendChild(elem);

    var payeeFinAccountElem = xmlDoc.createElement("cac:PayeeFinancialAccount");
    elem = xmlDoc.createElement("cbc:ID");
    elem.innerHTML = rechnung.supplierParty.financeAccount_id;
    payeeFinAccountElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:Name");
    elem.innerHTML = rechnung.supplierParty.financeAccount_name;
    payeeFinAccountElem.appendChild(elem);
    paymentElem.appendChild(payeeFinAccountElem);

    invoiceElem.appendChild(paymentElem);

    //Total amounts
    var taxTotalElem = xmlDoc.createElement("cac:TaxTotal");

    elem = xmlDoc.createElement("cbc:TaxAmount");
    elem.setAttribute("currencyID", "EUR");
    elem.innerHTML = rechnung.totalTax.toString();
    taxTotalElem.appendChild(elem);

    var taxSubtotalElem = xmlDoc.createElement("cac:TaxSubtotal");

    elem = xmlDoc.createElement("TaxableAmount");
    elem.setAttribute("currencyID", "EUR");
    elem.innerHTML = rechnung.taxableAmount.toString();
    taxSubtotalElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:TaxAmount");
    elem.setAttribute("currencyID", "EUR");
    elem.innerHTML = rechnung.totalTax.toString();
    taxSubtotalElem.appendChild(elem);

    var taxCategoryElem = xmlDoc.createElement("cac:TaxCategory");
    elem = xmlDoc.createElement("cbc:ID");
    elem.innerHTML = rechnung.taxCategory_id;
    taxCategoryElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:Percent");
    elem.innerHTML = rechnung.taxCategory_percent.toString();
    taxCategoryElem.appendChild(elem);

    var schemeElem = xmlDoc.createElement("cac:TaxScheme");
    elem = xmlDoc.createElement("cbc:ID");
    elem.innerHTML = rechnung.taxCategory_scheme;
    schemeElem.appendChild(elem);
    taxCategoryElem.appendChild(schemeElem);
    taxSubtotalElem.appendChild(taxCategoryElem);
    taxTotalElem.appendChild(taxSubtotalElem);

    invoiceElem.appendChild(taxTotalElem);

    //Monetary Total
    var monetaryTotalElem = xmlDoc.createElement("cac:LegalMonetaryTotal");
    elem = xmlDoc.createElement("cbc:LineExtensionsAmount");
    elem.setAttribute("currencyID", "EUR");
    elem.innerHTML = rechnung.taxableAmount.toString();
    monetaryTotalElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:TaxExclusiveAmount");
    elem.setAttribute("currencyID", "EUR");
    elem.innerHTML = rechnung.taxableAmount.toString();
    monetaryTotalElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:TaxInclusiveAmount");
    elem.setAttribute("currencyID", "EUR");
    elem.innerHTML = rechnung.totalAmount.toString();
    monetaryTotalElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:PrepaidAmount");
    elem.setAttribute("currencyID", "EUR");
    elem.innerHTML = rechnung.prepaidAmount.toString();
    monetaryTotalElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:PayableAmount");
    elem.setAttribute("currencyID", "EUR");
    elem.innerHTML = (rechnung.totalAmount - rechnung.prepaidAmount).toString();
    monetaryTotalElem.appendChild(elem);

    invoiceElem.appendChild(monetaryTotalElem);

    //invoice positions
    let lineElem, itemElem, itemIdentElem, taxElem, priceElem;
    rechnung.positions.forEach(pos => {
        lineElem = xmlDoc.createElement("cac:InvoiceLine");

        elem = xmlDoc.createElement("cbc:ID");
        elem.innerHTML = pos.pos_id.toString();
        lineElem.appendChild(elem);

        elem = xmlDoc.createElement("cbc:InvoicedQuantity");
        elem.setAttribute("unitCode", "C62");
        elem.innerHTML = pos.quantity.toString();
        lineElem.appendChild(elem);

        elem = xmlDoc.createElement("cbc:LineExtensionAmount");
        elem.setAttribute("currencyID", pos.currency_code);
        elem.innerHTML = pos.price.toString();
        lineElem.appendChild(elem);

        itemElem = xmlDoc.createElement("cac:Item");

        elem = xmlDoc.createElement("cbc:Name");
        elem.innerHTML = pos.description;
        itemElem.appendChild(elem);

        itemIdentElem = xmlDoc.createElement("cac:SellersItemIdentification");
        elem = xmlDoc.createElement("cbc:ID");
        elem.innerHTML = pos.item_id.toString();
        itemIdentElem.appendChild(elem);
        itemElem.appendChild(itemIdentElem);

        taxElem = xmlDoc.createElement("cac:ClassifiedTaxCategory");

        elem = xmlDoc.createElement("cbc:ID");
        elem.innerHTML = pos.tax_id;
        taxElem.appendChild(elem);

        elem = xmlDoc.createElement("cbc:Percent");
        elem.innerHTML = pos.tax_rate.toString();
        taxElem.appendChild(elem);

        schemeElem = xmlDoc.createElement("cac:TaxScheme");
        elem = xmlDoc.createElement("cbc:ID");
        elem.innerHTML = pos.tax_scheme;
        schemeElem.appendChild(elem);
        taxElem.appendChild(schemeElem);

        itemElem.appendChild(taxElem);

        lineElem.appendChild(itemElem);

        priceElem = xmlDoc.createElement("cac:Price");

        elem = xmlDoc.createElement("cbc:PriceAmount");
        elem.setAttribute("currencyID", pos.currency_code);
        elem.innerHTML = pos.price.toString();
        priceElem.appendChild(elem);

        elem = xmlDoc.createElement("cbc:BaseQuantity");
        elem.setAttribute("unitCode", "C62");
        elem.innerHTML = pos.quantity.toString();
        priceElem.appendChild(elem);

        lineElem.appendChild(priceElem);

        invoiceElem.appendChild(lineElem);
    });
    xmlDoc.appendChild(invoiceElem);

    return xmlDoc;
}

const createPartyXml = (company: Company): HTMLElement => {
    var partyElem = xmlDoc.createElement("cac:Party");

    let elem = xmlDoc.createElement("cbc:EndpointID");
    elem.setAttribute("schemeID", "EM");
    if(company.endpointId)
        elem.innerHTML = company.endpointId;
    partyElem.appendChild(elem);

    //Company's name
    var partyNameElem = xmlDoc.createElement("cac:PartyName");
    elem = xmlDoc.createElement("cbc:Name");
    elem.innerHTML = company.name;
    partyNameElem.appendChild(elem);
    partyElem.appendChild(partyNameElem);

    //Company's postal address 
    var postalAddressElem = xmlDoc.createElement("cac:PostalAddress");

    elem = xmlDoc.createElement("cbc:StreetName");
    elem.innerHTML = company.streetName;
    postalAddressElem.appendChild(elem); 

    elem = xmlDoc.createElement("cbc:CityName");
    elem.innerHTML = company.cityName;
    postalAddressElem.appendChild(elem);

    elem = xmlDoc.createElement("cbc:PostalZone");
    elem.innerHTML = company.postalZone;
    postalAddressElem.appendChild(elem);

    var countryElem = xmlDoc.createElement("cac:Country");
    elem = xmlDoc.createElement("cbc:IdentificationCode");
    elem.innerHTML = company.countryCode;
    countryElem.appendChild(elem);
    postalAddressElem.appendChild(countryElem);

    partyElem.appendChild(postalAddressElem);

    //Company's tax scheme VAT
    if(company.tax_vat){
        var taxVATElem = xmlDoc.createElement("cac:PartyTaxScheme");

        elem = xmlDoc.createElement("cbc:CompanyID");
        elem.innerHTML = company.tax_vat;
        taxVATElem.appendChild(elem);

        var schemeElem = xmlDoc.createElement("cac:TaxScheme");
        elem = xmlDoc.createElement("cbc:ID");
        elem.innerHTML = "VAT";
        schemeElem.appendChild(elem);
        taxVATElem.appendChild(schemeElem);

        partyElem.appendChild(taxVATElem);
    }

    //Company's tax scheme FC
    if(company.tax_fc){
        var taxFCElem = xmlDoc.createElement("cac:PartyTaxScheme");

        elem = xmlDoc.createElement("cbc:CompanyID");
        elem.innerHTML = company.tax_fc;
        taxFCElem.appendChild(elem);

        var taxElem = xmlDoc.createElement("cac:TaxScheme");
        elem = xmlDoc.createElement("cbc:ID");
        elem.innerHTML = "FC";
        taxElem.appendChild(elem);
        taxFCElem.appendChild(taxElem);

        partyElem.appendChild(taxFCElem);
    }

    //Company's legal entity name
    var legalEntityElem = xmlDoc.createElement("cac:PartyLegalEntity");

    elem = xmlDoc.createElement("cbc:RegistrationName");
    elem.innerHTML = company.legalEntity_name;
    legalEntityElem.appendChild(elem);

    partyElem.appendChild(legalEntityElem);

    //Company's contact
    if(company.contact) {
        var contactElem = xmlDoc.createElement("cac:Contact");

        elem = xmlDoc.createElement("cbc:Name");
        elem.innerHTML = company.contact.name;
        contactElem.appendChild(elem);

        elem = xmlDoc.createElement("cbc:Telephone");
        elem.innerHTML = company.contact.tel;
        contactElem.appendChild(elem);

        elem = xmlDoc.createElement("cbc:ElectronicMail");
        elem.innerHTML = company.contact.email;
        contactElem.appendChild(elem);

        partyElem.appendChild(contactElem);
    }

    return partyElem;
}

export {
    createXRechnung
}