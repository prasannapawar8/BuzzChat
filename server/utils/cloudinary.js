import cloudinary from 'cloudinary';

// Log the config on first use (lazy loading)
let configLogged = false;

export const uploadToCloudinary = async (file) => {
  // Load config on first upload attempt
  if (!configLogged) {
    const config = {
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };

    console.log('\n========== CLOUDINARY CONFIG DEBUG ==========');
    console.log('Environment Variables Available:');
    console.log('- CLOUDINARY_NAME:', process.env.CLOUDINARY_NAME ? '✅ SET' : '❌ MISSING');
    console.log('- CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ SET' : '❌ MISSING');
    console.log('- CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ SET' : '❌ MISSING');
    console.log('\nConfig Values:');
    console.log('- cloud_name:', config.cloud_name);
    console.log('- api_key first 8 chars:', config.api_key ? config.api_key.substring(0, 8) : 'MISSING');
    console.log('- api_secret first 8 chars:', config.api_secret ? config.api_secret.substring(0, 8) : 'MISSING');
    console.log('=============================================\n');

    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.error('⚠️  Cloudinary credentials are incomplete!');
      console.error('Required: CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
      console.error('Please check your .env file location and contents.\n');
    }

    cloudinary.v2.config(config);
    configLogged = true;
  }

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
