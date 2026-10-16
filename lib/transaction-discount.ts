export function calculateDiscountedPrice(
  type: string,
  quantity: string,
  price: string,
  discount: string,
): { price: number; total: number } | { error: string } | null {
  if (type !== '2' || discount.trim() === '') {
    return null;
  }

  const quantityValue = Number(quantity);
  const priceValue = Number(price);
  const discountValue = Number(discount);

  if (!Number.isFinite(quantityValue) || quantityValue <= 0) {
    return { error: 'Quantity must be greater than zero to apply a discount.' };
  }
  if (price.trim() === '' || !Number.isFinite(priceValue) || priceValue < 0) {
    return { error: 'Price must be a valid non-negative number to apply a discount.' };
  }
  if (!Number.isFinite(discountValue) || discountValue < 0) {
    return { error: 'Discount must be a valid non-negative amount.' };
  }

  const originalTotal = priceValue * quantityValue;
  if (!Number.isFinite(originalTotal)) {
    return { error: 'The transaction total is too large.' };
  }
  if (discountValue > originalTotal) {
    return { error: 'Discount cannot exceed the total price.' };
  }

  const total = originalTotal - discountValue;
  const discountedPrice = total / quantityValue;
  if (!Number.isFinite(discountedPrice)) {
    return { error: 'The discounted unit price is too large.' };
  }
  return { price: discountedPrice, total };
}
