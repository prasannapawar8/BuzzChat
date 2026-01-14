import cloudinary from 'cloudinary';

// Verify Cloudinary configuration
const config = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

console.log('Cloudinary Config:', {
  cloud_name: config.cloud_name,
  api_key: config.api_key ? config.api_key.substring(0, 5) + '...' : 'MISSING',
  api_secret: config.api_secret ? config.api_secret.substring(0, 5) + '...' : 'MISSING',
});

if (!config.cloud_name || !config.api_key || !config.api_secret) {
  console.error('⚠️  Cloudinary credentials are incomplete!');
  console.error('Required: CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

cloudinary.v2.config(config);

export const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      const err = new Error('Invalid file object - no buffer found');
      console.error('Upload error:', err.message);
      return reject(err);
    }

    console.log('Starting upload to Cloudinary:', {
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    });

    const stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'buzzchat',
        timeout: 60000,
        eager: [{ format: 'webp' }],
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload failed:', {
            message: error.message,
            http_code: error.http_code,
            error: error.error,
          });
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          console.log('✅ Cloudinary upload success:', {
            url: result.secure_url,
            public_id: result.public_id,
            size: result.bytes,
          });
          resolve(result);
        }
      }
    );

    stream.on('error', (err) => {
      console.error('❌ Stream error:', err);
      reject(new Error(`Stream error: ${err.message}`));
    });

    stream.on('timeout', () => {
      console.error('❌ Upload timeout');
      reject(new Error('Upload timeout - file may be too large'));
    });

    stream.end(file.buffer);
  });
};
