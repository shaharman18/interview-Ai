// MUST be first: force IPv4 before any network calls (fixes ENETUNREACH on Render)
require('dns').setDefaultResultOrder('ipv4first');

require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');






const PORT = process.env.PORT || 3000;  

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to the database', err);
  process.exit(1);
});
                                    

