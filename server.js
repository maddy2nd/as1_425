const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require('dotenv').config();


app.get('/', (req, res) => {
    res.status(200).send({message:"Working"});
  });

  app.post('/api/listings', async (req, res) => {
    try {
      const new_listing = await db.addNewListing(req.body);
      res.status(201).send(new_listing);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  app.get('/api/listings', async (req, res) => {
    const { page, perPage, name } = req.query;
    try {
      const listings = await db.getAllListings(page, perPage, name);
      res.status(200).send(listings);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  app.get('/api/listings/:id', async (req, res) => {
    const listing_id = req.params.id;
    try {
      const listing = await db.getListingById(listing_id);
      if (listing) {
        res.status(200).send(listing);
      } else {
        res.status(404).send({ error: 'Listing not found' });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  app.put('/api/listings/:id', async (req, res) => {
    const listing_id = req.params.id;
    const listing_data = req.body;
    try {
      const result = await db.updateListingById(listing_data, listing_id);
      if (result.matchedCount > 0) {
        res.status(200).send({ message: 'Listing updated successfully' });
      } else {
        res.status(404).send({ error: 'Listing not found' });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  app.delete('/api/listings/:id', async (req, res) => {
    const listing_id = req.params.id;
    try {
      const result = await db.deleteListingById(listing_id);
      if (result.deletedCount > 0) {
        res.status(204).send({ message: 'Listing deleted successfully' });
      } else {
        res.status(404).send({ error: 'Listing not found' });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

//   app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{console.log(err);});
