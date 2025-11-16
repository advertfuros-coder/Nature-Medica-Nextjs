/**
 * Validates Indian mobile number
 * Must be 10 digits and start with 6, 7, 8, or 9
 */
export function validateIndianMobile(phone) {
  if (!phone) return false;
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if exactly 10 digits and starts with 6, 7, 8, or 9
  const regex = /^[6-9][0-9]{9}$/;
  return regex.test(cleaned);
}

/**
 * Cleans and formats phone number for Shiprocket
 * Returns 10-digit number or null if invalid
 */
export function formatPhoneForShiprocket(phone) {
  if (!phone) return null;
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Remove country code if present (91)
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  }
  
  // Remove leading 0 if present
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // Remove +91 or other prefixes
  if (cleaned.length > 10) {
    cleaned = cleaned.slice(-10); // Take last 10 digits
  }
  
  // Validate final number
  if (validateIndianMobile(cleaned)) {
    return cleaned;
  }
  
  return null;
}

/**
 * Validates Indian pincode
 */
export function validateIndianPincode(pincode) {
  if (!pincode) return false;
  const cleaned = pincode.replace(/\D/g, '');
  return /^[1-9][0-9]{5}$/.test(cleaned);
}
