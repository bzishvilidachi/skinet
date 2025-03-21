# SkiNet Project Repository

##  About the Project
Welcome to the **SkiNet** application, built using **.NET 8** and **Angular 18**. 

---

##  Running the Project



###  Prerequisites
Before running the project locally, ensure you have installed:
- **Docker**
- **.NET SDK v8**
- **NodeJS (v20.11.1 or later)** _(Optional for Angular dev server)_

---

##  Installation & Setup

###  Clone the Repository
```sh
# Ensure Git is installed
git clone https://github.com/TryCatchLearn/skinet-2024.git
cd skinet-2024
```

###  Restore Dependencies
```sh
# From the root folder
dotnet restore
```

###  Install Angular Dependencies _(Optional)_
```sh
cd client
npm install
```

---

##  Stripe Integration (Optional)
To enable payment functionality, configure Stripe:

1. Create a **Stripe account** and retrieve API keys.
2. In the `API` folder, create a file named `appsettings.json` and add:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "StripeSettings": {
    "PublishableKey": "pk_test_REPLACEME",
    "SecretKey": "sk_test_REPLACEME",
    "WhSecret": "whsec_REPLACEME"
  },
  "AllowedHosts": "*"
}
```

###  Enable Stripe Webhooks
1. Install **Stripe CLI**.
2. Login and listen for webhook events:
```sh
stripe login
stripe listen --forward-to https://localhost:5001/api/payments/webhook -e payment_intent.succeeded
```

---

##  Database & Redis Setup
The app requires **SQL Server** and **Redis**. Start them using Docker:
```sh
# Run from project root (skinet-2024)
docker compose up -d
```
Ensure no conflicting services are running on **ports 1433 (SQL Server)** or **6379 (Redis)**.

---

##  Running the Application

###  Running the .NET API
```sh
cd API
dotnet run
```
Then, access it at: **https://localhost:5001**

###  Running Angular Frontend _(Optional)_
1. Install a self-signed SSL certificate:
```sh
cd client/ssl
mkcert localhost
```
2. Start the Angular app:
```sh
cd client
ng serve
```
3. Open in browser: **https://localhost:4200**

---

##  Testing Payments
Use [Stripe test cards](https://stripe.com/docs/testing) for payment testing.

---



