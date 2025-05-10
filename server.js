const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// Data storage - in a real app, you'd use a database
const DATA_FILE = path.join(__dirname, 'analytics_data.json');

// Initialize data file if it doesn't exist
async function initDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch (error) {
        // File doesn't exist, create it with empty data
        await fs.writeFile(DATA_FILE, JSON.stringify({ visits: [] }));
    }
}

// Read data from file
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        return { visits: [] };
    }
}

// Write data to file
async function writeData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data file:', error);
    }
}

// API endpoint to track visits
app.post('/api/track', async (req, res) => {
    try {
        const visitData = req.body;
        
        // Add IP address (anonymized for privacy)
        const ip = req.ip || req.connection.remoteAddress;
        visitData.ipHash = Buffer.from(ip).toString('base64').substring(0, 10);
        
        // Add server timestamp
        visitData.serverTimestamp = new Date().toISOString();
        
        // Store the data
        const data = await readData();
        data.visits.push(visitData);
        await writeData(data);
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error tracking visit:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// API endpoint to get analytics data
app.get('/api/analytics', async (req, res) => {
    try {
        const data = await readData();
        
        // Filter by card ID if provided
        const cardId = req.query.cardId;
        if (cardId) {
            data.visits = data.visits.filter(visit => visit.cardId === cardId);
        }
        
        // Filter by date range if provided
        const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
        
        if (startDate && endDate) {
            data.visits = data.visits.filter(visit => {
                const visitDate = new Date(visit.timestamp);
                return visitDate >= startDate && visitDate <= endDate;
            });
        }
        
        res.status(200).json(data);
    } catch (error) {
        console.error('Error getting analytics data:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// API endpoint to get unique cards
app.get('/api/cards', async (req, res) => {
    try {
        const data = await readData();
        
        // Get unique cards
        const uniqueCards = {};
        data.visits.forEach(visit => {
            if (visit.cardId && !uniqueCards[visit.cardId]) {
                uniqueCards[visit.cardId] = {
                    id: visit.cardId,
                    businessName: visit.businessName || 'Unknown',
                    firstSeen: visit.timestamp,
                    visits: 0
                };
            }
            if (visit.cardId) {
                uniqueCards[visit.cardId].visits++;
                // Update firstSeen if this visit is earlier
                if (new Date(visit.timestamp) < new Date(uniqueCards[visit.cardId].firstSeen)) {
                    uniqueCards[visit.cardId].firstSeen = visit.timestamp;
                }
            }
        });
        
        res.status(200).json(Object.values(uniqueCards));
    } catch (error) {
        console.error('Error getting cards:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Start the server
async function startServer() {
    await initDataFile();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Dashboard available at: http://localhost:${PORT}/dashboard.html`);
    });
}

startServer(); 