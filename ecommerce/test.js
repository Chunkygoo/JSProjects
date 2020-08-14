const crypto = require('crypto');
// Using the factory defaults.
crypto.scrypt('secret', 'salt', 64, (err, derivedKey) => {
    if (err) throw err;
    console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});