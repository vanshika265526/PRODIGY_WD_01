// server.js

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

// RapidAPI Hotels API Key (Replace with your actual key)
const RAPID_API_KEY = "YOUR_RAPID_API_KEY";
const RAPID_API_HOST = "hotels4.p.rapidapi.com";

// 🎯 Search Hotels API
app.get("/api/hotels", async (req, res) => {
    try {
        const { location } = req.query;
        const options = {
            method: 'GET',
            url: 'https://hotels4.p.rapidapi.com/locations/v3/search',
            params: {
                q: location
            },
            headers: {
                'X-RapidAPI-Key': RAPID_API_KEY,
                'X-RapidAPI-Host': RAPID_API_HOST
            }
        };

        const response = await axios.request(options);
        
        // Get hotels for the first location
        if (response.data.sr && response.data.sr.length > 0) {
            const locationId = response.data.sr[0].gaiaId;
            const hotelsOptions = {
                method: 'GET',
                url: 'https://hotels4.p.rapidapi.com/properties/v2/list',
                params: {
                    regionId: locationId,
                    checkInDate: new Date().toISOString().split('T')[0],
                    checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    adults: '1'
                },
                headers: {
                    'X-RapidAPI-Key': RAPID_API_KEY,
                    'X-RapidAPI-Host': RAPID_API_HOST
                }
            };

            const hotelsResponse = await axios.request(hotelsOptions);
            res.json(hotelsResponse.data);
        } else {
            res.json({ hotels: [] });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Error fetching hotels." });
    }
});

// 🎯 Check Booking API
app.get("/api/booking/:id", async (req, res) => {
    try {
        const bookingId = req.params.id;
        const options = {
            method: 'GET',
            url: 'https://hotels4.p.rapidapi.com/properties/v2/detail',
            params: {
                propertyId: bookingId
            },
            headers: {
                'X-RapidAPI-Key': RAPID_API_KEY,
                'X-RapidAPI-Host': RAPID_API_HOST
            }
        };

        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Error fetching booking details." });
    }
});

// 🎯 Customer Support API
app.post("/api/support", async (req, res) => {
    try {
        const { message } = req.body;
        // For demo purposes, we'll just return a success message
        res.json({ 
            success: true, 
            message: "Support ticket received. We'll get back to you soon." 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Error processing support request." });
    }
});

// Serve frontend
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
