export const user = {
    login: '/user/auth/signin',
    register: '/user/auth/signup',
    forgotPassword: '/user/auth/forgot-password',
    resetPassword: '/user/auth/reset-password',
    changePassword: '/change-password',
    savedProperties: '/user/saved-properties'
}

export const image = {
    // upload: '/media/upload-image',
    // delete: '/media/delete-image',
    upload: '/upload',
    delete: '/delete-upload',
}

export const property = {
    list: '/properties',
    create: '/property/create',
    save: '/property/save',
    removeSaved: '/property/remove-saved',
    update: '/properties', // /:id
    delete: '/properties', // /:id
    media: '/property-media', // POST, PUT(/:id), DELETE(/:id)
    myProperties: '/my-properties', // Assuming root level based on user request, or adjust if it's /property/my-properties
    coverImage: '/properties' // Will append /:id/cover-image
}

export const admin = {
    dashboard: '/admin/analytics/dashboard',
    deletedProperties: '/admin/properties',
    propertyAnalytics: '/analytics/property',
    propertyView: '/analytics/property/view',
    propertyAccess: '/admin/property-access'
}

export const broker = {
    list: '/admin/brokers',
    details: '/admin/brokers', // :id will be appended
    delete: '/admin/brokers', // :id will be appended
}

export const adminUsers = {
    base: '/admin/users', // Append /:role
    customer: '/admin/users/customer',
    admin: '/admin/users/admin'
}

export const location = {
    nearby: '/properties/nearby'
}