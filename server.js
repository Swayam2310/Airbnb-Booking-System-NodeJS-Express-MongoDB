const express = require('express');
const { MongoClient, Decimal128, ObjectId } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// MongoDB connection URI and client setup
const uri = "mongodb+srv://swayampatel2310:********@cluster0.ottja.mongodb.net/";
const client = new MongoClient(uri);

// Database reference
let db;

// Connect to MongoDB and handle errors
async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db("sample_airbnb");
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit if connection fails
  }
}

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Enable CORS (only if needed for frontend-backend communication)

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route: Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Bookings Page
app.get('/bookings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bookings.html'));
});

// Route: Fetch Filtered Listings
app.get('/listings', async (req, res, next) => {
  const { location, propertyType, bedrooms } = req.query;

  try {
    const query = {
      ...(location && { 'address.market': location }),
      ...(propertyType && { property_type: propertyType }),
      ...(bedrooms && { bedrooms: parseInt(bedrooms) })
    };

    const listings = await db.collection('listingsAndReviews').find(query).toArray();

    // Convert Decimal128 price values to numbers for each listing
    listings.forEach(listing => {
      if (listing.price instanceof Decimal128) {
        listing.price = parseFloat(listing.price.toString());
      }
    });

    res.json(listings);
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    next(error); // Forward to error handler
  }
});

// Route: Fetch Random Listings (for the bottom section)
app.get('/listings/random', async (req, res, next) => {
  try {
    const randomListings = await db.collection('listingsAndReviews')
      .aggregate([{ $sample: { size: 10 } }]) // Get 10 random listings
      .toArray();

    // Convert Decimal128 price values to numbers
    randomListings.forEach(listing => {
      if (listing.price instanceof Decimal128) {
        listing.price = parseFloat(listing.price.toString());
      }
    });

    res.json(randomListings);
  } catch (error) {
    console.error('Failed to fetch random listings:', error);
    next(error); // Forward to error handler
  }
});

// Route: Fetch property details by listing_id
app.get('/listings/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching property with ID: ${id}`); // Debugging

  try {
    const property = await db.collection('listingsAndReviews').findOne({ _id: id });

    if (!property) {
      console.log('Property not found');
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route: Handle booking submission
app.post('/bookings', async (req, res, next) => {
  try {
    const { listing_id, startDate, endDate, name, email, daytimePhone, phone, postalAddress, homeAddress } = req.body;

    // Validate required fields
    if (!listing_id || !startDate || !endDate || !name || !email) {
      return res.status(400).json({ error: 'Please provide all required booking details.' });
    }

    const booking = {
      listing_id,
      startDate,
      endDate,
      name,
      email,
      daytimePhone, // New field for daytime phone number
      phone,
      postalAddress, 
      homeAddress,   
    };

    const result = await db.collection('bookings').insertOne(booking);

    res.status(201).json({ id: result.insertedId, message: 'Booking added successfully' });
  } catch (error) {
    console.error('Failed to add booking:', error);
    next(error);
  }
});

// Route: Fetch all bookings for a specific listing
app.get('/listings/:id/bookings', async (req, res, next) => {
  const listing_id = req.params.id;

  try {
    const bookings = await db.collection('bookings').find({ listing_id }).toArray();

    if (bookings.length === 0) {
      return res.status(404).json({ error: 'No bookings found for this listing.' });
    }

    res.json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    next(error);
  }
});

// Route: Get Booking by ID
app.get('/bookings/:id', async (req, res) => {
  const { id } = req.params; // Extract booking ID from the request URL
  console.log(`Received request for booking ID: ${id}`);

  try {
    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Error Handler: 404 Not Found
app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});

// Error Handler: 500 Internal Server Error
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(500).send('Internal Server Error');
});

// Start the Server after connecting to MongoDB
const PORT = 3000;
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
