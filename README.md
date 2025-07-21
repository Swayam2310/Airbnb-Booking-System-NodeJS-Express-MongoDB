# Airbnb-Booking-System-NodeJS-Express-MongoDB

A full-stack web database application that allows users to search and book Airbnb listings based on their preferences. Built using Node.js, Express.js, and MongoDB Atlas, this application provides a seamless interface to filter properties and make bookings.

##  Features

- **Homepage Filtering**
  - Users can search properties by:
    - Location (required)
    - Property type (optional)
    - Number of bedrooms (optional)
  - Listings are displayed dynamically based on filters.
  - Each listing includes name, summary, price, and review rating.
  - Listings link to a booking form for user convenience.

- **Booking Form**
  - Clients can enter:
    - Start and end date
    - Full name
    - Email address
    - Phone numbers
    - Postal and home address
  - Upon submission, booking data is stored in MongoDB.

- **Booking Confirmation**
  - After submitting a booking, users are redirected to a confirmation page.
  - Includes a link to return to the homepage.

##  Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** HTML, CSS, JavaScript
- **Database:** MongoDB Atlas
- **Templating / Structure:** EJS / Static HTML (customizable)


