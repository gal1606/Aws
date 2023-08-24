
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Dummy data for employee information
const employees = [
  { name: 'Micheal Scott', age: 52, yearsEmployed: 15, division: 'Manager' },
  { name: 'Dwight Schrute', age: 36, yearsEmployed: 8, division: 'Sales' },
  { name: 'Jim Halpert', age: 34, yearsEmployed: 8, division: 'Sales' },
  { name: 'Kevin Malone', age: 35, yearsEmployed: 5, division: 'Finance' },
  { name: 'Angela Martin', age: 37, yearsEmployed: 7, division: 'Finance' },
  { name: 'Oscar Martinez', age: 40, yearsEmployed: 10, division: 'Finance' },
  { name: 'Pamela Beesley', age: 31, yearsEmployed: 5, division: 'Office Administrator' },
  { name: 'Tobi Flanderson', age: 42, yearsEmployed: 4, division: 'Human Resources' },
  // Add more employees here...
];

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Simulate authentication logic
  if (email === 'user@example.com' && password === 'password') {
    req.session.isAuthenticated = true;
    res.redirect('/employees'); // Redirect to employees route
  } else {
    res.redirect('/');
  }
});

// Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Employees page
app.get('/employees', (req, res) => {
  if (req.session.isAuthenticated) {
    res.render('employees', { employees }); // Render employees.ejs with employee data
  } else {
    res.redirect('/');
  }
});

// Dummy data for customer information
const customers = [
  { name: 'John Doe', phone: '123456789', email: 'john@example.com' },
  { name: 'Jane Smith', phone: '987654321', email: 'jane@example.com' },
  { name: 'Michael Johnson', phone: '456789123', email: 'michael@example.com' },
  { name: 'Emily Brown', phone: '789123456', email: 'emily@example.com' },
  { name: 'David Davis', phone: '654321789', email: 'david@example.com' },
  { name: 'Sarah Miller', phone: '321789456', email: 'sarah@example.com' },
  { name: 'Robert Wilson', phone: '741852963', email: 'robert@example.com' },
  { name: 'Linda Taylor', phone: '852963741', email: 'linda@example.com' },
  { name: 'William Martinez', phone: '963741852', email: 'william@example.com' },
  { name: 'Karen Anderson', phone: '369258147', email: 'karen@example.com' },
  { name: 'Daniel White', phone: '258147369', email: 'daniel@example.com' },
  { name: 'Jessica Harris', phone: '147369258', email: 'jessica@example.com' },
  { name: 'Thomas Jackson', phone: '369147258', email: 'thomas@example.com' },
  { name: 'Nancy Lee', phone: '852147963', email: 'nancy@example.com' },
  { name: 'Paul Clark', phone: '741963852', email: 'paul@example.com' },
  // Add more customers here...
];

// Customers page
app.get('/customers', (req, res) => {
  if (req.session.isAuthenticated) {
    res.render('customers', { customers }); // Render customers.ejs with customer data
  } else {
    res.redirect('/');
  }
});

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/book-appointment', (req, res) => {
  if (req.session.isAuthenticated) {
    const { clientName, clientEmail, employeeName, appointmentDate, appointmentTime } = req.body;

    // Create a transporter with your email configuration
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    // Construct the email content
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: ['gal160693@gmail.com', clientEmail], // Send to both Gal and the client
      subject: 'Appointment Details',
      text: `Dear ${clientName}, your appointment is booked with ${employeeName} on ${appointmentDate} at ${appointmentTime}.`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Redirect to a confirmation page or any other desired page
    res.redirect('/confirmation');
  } else {
    res.redirect('/');
  }
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

