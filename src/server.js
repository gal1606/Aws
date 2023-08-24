const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// MySQL database connection configuration
const dbConfig = {
  host: 'colman-final-db.cuxucm3ycpqd.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '9953475',
  database: 'colman-final-db'
};

// Create a database connection
const connection = mysql.createConnection(dbConfig);

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Dummy data for employee information
const employees = [
  { name: 'Micheal Scott', age: 52, yearsEmployed: 15, division: 'Manager' },
  { name: 'Dwight Schrute', age: 36, yearsEmployed: 8, division: 'Sales' },
  // ... (add more employees here)
];

// Login route
app.post('/login', (req, res) => {
  console.log('Login route handler called');
  const { email, password } = req.body;

  // Simulate authentication logic
  if (email === 'user@example.com' && password === 'password') {
    req.session.isAuthenticated = true;
    console.log('Authentication successful');
    res.redirect('http://finallb-1119723557.us-east-1.elb.amazonaws.com:3000/employees'); // Redirect to employees route
  } else {
    console.log('Authentication failed');
    res.redirect('/');
  }
});

// Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Employees page
app.get('/employees', (req, res) => {
  console.log('Employees route accessed');
  if (req.session.isAuthenticated) {
    connection.query('SELECT * FROM employees', (err, results) => {
      if (err) {
        console.error('Error fetching employees:', err);
        res.status(500).send('Internal server error');
        return;
      }
      res.render('employees', { employees: results });
    });
  } else {
    res.redirect('/');
  }
});

// Dummy data for customer information
const customers = [
  { name: 'John Doe', phone: '123456789', email: 'john@example.com' },
  { name: 'Jane Smith', phone: '987654321', email: 'jane@example.com' },
  // ... (add more customers here)
];

// Customers page
app.get('/customers', (req, res) => {
  if (req.session.isAuthenticated) {
    res.render('customers', { customers }); // Render customers.ejs with customer data
  } else {
    res.redirect('/');
  }
});

// ... (booking appointment route remains the same)

// Close the database connection on application exit
process.on('exit', () => {
  connection.end();
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
