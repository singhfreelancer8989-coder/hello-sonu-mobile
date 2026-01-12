
export const filterPropertiesByCategory = (properties, category) => {
    if (!properties || !Array.isArray(properties) || properties.length === 0 || !category) {
        return [];
    }

    // Filter is case-insensitive and trims whitespace for robustness
    const normalizedCategory = category.trim().toLowerCase();

    return properties.filter(property => {
        const cat = property.propertyCategory || property.category || '';
        const normalizeCat = cat.trim().toLowerCase();

        // Loose matching for diverse backend data
        if (normalizedCategory === 'house_apartment' || normalizedCategory === 'house/apartment/flat') {
            return ['house_apartment', 'flats', 'house/apartment/flat', 'house', 'apartment', 'villa'].some(c => normalizeCat.includes(c));
        }
        if (normalizedCategory === 'office_shop' || normalizedCategory === 'shop/godown/office') {
            return ['office_shop', 'shop', 'office', 'godown'].some(c => normalizeCat.includes(c));
        }
        if (normalizedCategory === 'agriculture_land' || normalizedCategory === 'agriculturalland/farmhouses') {
            return ['agriculture_land', 'agricultural', 'farm', 'land'].some(c => normalizeCat.includes(c));
        }

        return normalizeCat === normalizedCategory;
        return normalizeCat === normalizedCategory;
    });
};

export const mapBudgetToParams = (budgetLabel) => {
    if (!budgetLabel) return {};
    // Normalize: remove spaces, uppercase
    const label = String(budgetLabel).replace(/\s/g, '').toUpperCase();

    // conventions: "10L+", "25L", etc.
    if (label.includes('10L')) return { minPrice: 1000000 };
    if (label.includes('25L')) return { minPrice: 2500000 };
    if (label.includes('50L')) return { minPrice: 5000000 };
    if (label.includes('1CR')) return { minPrice: 10000000 };

    return {};
};