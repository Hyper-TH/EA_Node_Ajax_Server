// Helper function to generate a random SKU
export const generateSKU = () => {
    return Math.floor(100000 + Math.random() * 900000);  // Generates a 6-digit number
};

// Helper function to generate a random UPC
export const generateUPC = () => {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
};