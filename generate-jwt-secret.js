const crypto = require('crypto');

// Generate a secure JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('🔐 SECURE JWT SECRET GENERATED:');
console.log('');
console.log('Copy this EXACT value for your Render environment variable:');
console.log('');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');
console.log('⚠️  IMPORTANT: This is a one-time generation. Save this value!');
console.log('🔒 This secret will be used to sign your authentication tokens.');