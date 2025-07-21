// Extract booking_id from the URL
const params = new URLSearchParams(window.location.search);
const bookingId = params.get('booking_id');

async function fetchBookingDetails() {
  try {
    const response = await fetch(`http://localhost:3000/bookings/${bookingId}`);
    if (!response.ok) throw new Error('Failed to load booking details.');

    const booking = await response.json();

    // Populate booking details on the confirmation page
    document.getElementById('bookingId').textContent = bookingId;
    document.getElementById('checkInDate').textContent = booking.startDate;
    document.getElementById('checkOutDate').textContent = booking.endDate;
    document.getElementById('name').textContent = booking.name;
    document.getElementById('email').textContent = booking.email;
    document.getElementById('daytimePhone').textContent = booking.daytimePhone; // New field for daytime phone
    document.getElementById('phone').textContent = booking.phone;
    document.getElementById('postalAddress').textContent = booking.postalAddress;
    document.getElementById('homeAddress').textContent = booking.homeAddress;
  } catch (error) {
    alert('Failed to load booking details. Please try again.');
  }
}

// Fetch booking details on page load
fetchBookingDetails();
