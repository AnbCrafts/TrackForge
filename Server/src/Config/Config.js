// config.ts

 const Config = {
  PORT: 9000,
  MONGO_DB_URI: 'mongodb+srv://anubhaw2205:anb22051902@cluster0.xu3tbru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  JWT_SECRET: 'f2c1b3e87a1d4e2f9f6e8c78d5b0d7e2e9a6c5f3d2b4a1c9f8e7b6d5c4a3f2e1',
  JWT_EXPIRES_IN: '1d',
  CLOUDINARY: {
    CLOUD_NAME: 'anbcrafts',
    CLOUD_API_KEY: '547167784397773',
    CLOUD_API_SECRET: '239nrjKgXOWO9luN-P50laWCit4',
    CLOUDINARY_URL: 'cloudinary://547167784397773:239nrjKgXOWO9luN-P50laWCit4@anbcrafts',
  },
  HASH_SECRET: 'Yy9!Ffwk_+@54$+trackForge@secret__2025!@',
};

export default Config
