const currencySymbol = process.env.CURRENCY_SYMBOL || "";

function formatCurrency(value) {
    const number = Intl.NumberFormat("en", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false,
    });
    const numericValue = Number(value);
    const sign = numericValue < 0 ? "-" : "";

    return `${sign}${currencySymbol}${number.format(Math.abs(numericValue))}`;
}

export function formatPrice(price) {
    return formatCurrency(price);
}

export function formatQuantity2(quantity) {
    return formatCurrency(quantity);
}

export function formatQuantity(quantity, decimal_places) {

    if (!decimal_places) {
        decimal_places = 2;
    }
    const floatValue = Number.parseFloat(quantity);
    const roundedValue = floatValue.toFixed(decimal_places);
    return roundedValue;
}