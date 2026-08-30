import dns from 'node:dns/promises';
import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Connections and listeners
const PORT = process.env.PORT || 5000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () =>
      console.log('Server Opened & Connected to Database')
    );
  })
  .catch((error) => console.log(error));

