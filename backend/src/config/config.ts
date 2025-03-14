export const config = {
    port: process.env.PORT || 3001,
    mongoUri: process.env.MONGO_URI,
    uploadDir: 'uploads' // Temporary storage for all resume files
};