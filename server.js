const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/User');
const Inquiry = require('./models/Inquiry');
const Event = require('./models/Event');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'lsds_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve images

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const mongoUri = 'mongodb+srv://admin2:lsdsUser2@lsds-web-cluster.mw2e9.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err.message));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: storage });

// **User Registration Route**
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, id_num, role } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: '❌ Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, id_num, role });

        await newUser.save();
        res.status(201).json({ message: '✅ User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: '❌ Server error', error });
    }
});

// **User Login Route**
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: '❌ User not found. Please register first.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: '❌ Invalid email or password' });
        }

        req.session.user = { name: user.name, role: user.role, email: user.email };
        res.status(200).json({ message: '✅ Login successful', user: req.session.user });
    } catch (error) {
        res.status(500).json({ message: '❌ Server error', error });
    }
});

// **Session Check**
app.get('/session', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'No active session' });
    }
});

// **Logout Route**
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: '❌ Error logging out' });
        res.status(200).json({ message: '✅ Logged out successfully' });
    });
});

// **Contact Form Submission**
app.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: '❌ All fields are required' });
        }

        const newInquiry = new Inquiry({ name, email, message });
        await newInquiry.save();

        res.status(201).json({ message: '✅ Inquiry submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: '❌ Server error', error });
    }
});

// Create an event
app.post("/events", upload.single("eventImage"), async (req, res) => {
    try {
        const { title, description, dateTime, location, status } = req.body;
        const eventPicture = req.file ? req.file.filename : "default.jpg";

        const newEvent = new Event({ title, description, dateTime, location, status, eventPicture });
        await newEvent.save();

        res.status(201).json({ message: "Event created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to create event", error });
    }
});

// Delete an event by ID
app.delete("/events/:id", async (req, res) => {
    try {
        const eventId = req.params.id;

        // Validate ObjectID
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: "❌ Invalid event ID" });
        }

        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ message: "❌ Event not found" });
        }

        res.status(200).json({ message: "✅ Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "❌ Error deleting event", error });
    }
});

// Update an event by ID
app.put("/events/:id", upload.single("eventImage"), async (req, res) => {
    try {
        const eventId = req.params.id;
        const { title, description, dateTime, location, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: "❌ Invalid event ID" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "❌ Event not found" });
        }

        event.title = title;
        event.description = description;
        event.dateTime = dateTime;
        event.location = location;
        event.status = status;

        if (req.file) {
            event.eventPicture = req.file.filename;
        }

        await event.save();
        res.status(200).json({ message: "✅ Event updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "❌ Failed to update event", error });
    }
});


// Fetch events with optional filtering (all/upcoming/past) or via search
app.get('/events', async (req, res) => {
    try {
        const { filter, search } = req.query;
        let query = {};

        if (filter === 'upcoming' || filter === 'past') {
            query.status = filter;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const events = await Event.find(query).sort({ dateTime: 1 });

        const formattedEvents = events.map(event => ({
            id: event._id.toString(),
            title: event.title,
            description: event.description,
            dateTime: event.dateTime,
            location: event.location,
            status: event.status,
            eventPicture: event.eventPicture
        }));

        res.status(200).json(formattedEvents);
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch events', error });
    }
});

app.get("/events/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "❌ Event not found" });
        }

        res.status(200).json({
            id: event._id.toString(),
            title: event.title,
            description: event.description,
            dateTime: event.dateTime,
            location: event.location,
            status: event.status,
            eventPicture: event.eventPicture
        });
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching event", error });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
