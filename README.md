Modern Banking System
This is a simple banking system designed to manage user accounts and transactions. Users can securely log in, send transactions to others using their card numbers, view transaction histories, and search transactions with live search functionality. Admins have access to all users and transactions with complete control over the system.

Features
User Authentication:
Login via Google OAuth 2.0.
Local strategy for password-based login, with secure password hashing using Bcrypt.
User Functionality:
Send transactions using client card numbers.
View and search transaction history with a live search feature.
Admin Functionality:
View all users and transactions.
Control over user accounts and transaction data.
Secure & Scalable:
Built on Express and Node.js with MongoDB as the database (hosted in a cluster).
Deployed using Azure Web App Service.
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/Aexaryan/modern-banking-system.git
cd modern-banking-system
Install dependencies:

bash
Copy code
npm install
Create a .env file in the root directory and add the following:

plaintext
Copy code
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=your-session-secret
MONGO_URI=your-mongodb-cluster-uri
Start the application:

bash
Copy code
npm start
The application will run on http://localhost:3000.

Sample API Endpoints
Here are some key API endpoints with their functionality:

Authentication
POST /auth/google
Initiates Google OAuth 2.0 login.

POST /auth/local
Logs in using email and password (local strategy).

GET /auth/logout
Logs out the user and ends the session.

User Routes
GET /users/:id
Fetches user details by ID.

GET /users/:id/transactions
Retrieves the transaction history for a specific user.

Transaction Routes
POST /transactions
Sends a transaction to another user.
Request body example:

json
Copy code
{
  "receiverCardNumber": "1234567890123456",
  "amount": 500
}
GET /transactions/search?q=term
Performs a live search for transactions matching the query term.

Admin Routes
GET /admin/users
Fetches all users in the system.

GET /admin/transactions
Fetches all transactions in the system.

DELETE /admin/users/:id
Deletes a specific user.

Technologies Used
Backend: Node.js, Express.js
Authentication: Passport.js (Google OAuth 2.0 and Local Strategy with bcrypt)
Database: MongoDB (cluster)
Frontend: EJS templates, CSS
Deployment: Azure Web App Service
Deployment
The app is deployed using Azure Web App Service. Use the following steps to deploy the app:

Set up an Azure Web App service in your Azure account.
Link the repository to the Azure Web App service.
Push the latest changes to the main branch, and Azure will deploy automatically.
Future Plans
This app will be further developed to include more features, serving as a prototype for building a robust authentication system for banking or financial applications.

Contribution
If you'd like to contribute:

Fork the repository.
Create a feature branch (git checkout -b feature-branch-name).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature-branch-name).
Open a pull request.
Contact
GitHub: Alexander Aryanfar
LinkedIn: Alexander Aryanfar
License
