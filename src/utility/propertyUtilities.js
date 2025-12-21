
export const filterPropertiesByCategory = (properties, category) => {
    if (!properties || properties.length === 0 || !category) {
        return [];
    }

    // Filter is case-insensitive and trims whitespace for robustness
    const normalizedCategory = category.trim().toLowerCase();

    return properties.filter(property =>
        property.category && property.category.trim().toLowerCase() === normalizedCategory
    );
};