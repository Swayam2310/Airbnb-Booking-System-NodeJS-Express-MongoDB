function getListingIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('listing_id');
}

// Step 2: Fetch property details using the listing_id
async function fetchPropertyDetails(listing_id) {
  try {
    console.log(`Fetching property details for ID: ${listing_id}`); // Debugging

    const response = await fetch(`http://localhost:3000/listings/${listing_id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch property details: ${response.statusText}`);
    }

    const property = await response.json();
    console.log('Fetched Property:', property); // Debugging
    return property;
  } catch (error) {
    console.error('Error fetching property details:', error);
    document.getElementById('propertyName').textContent = 'Property not found';
    return null;
  }
}

// Step 3: Display property details on the bookings page
async function displayPropertyDetails() {
  const listing_id = getListingIdFromUrl();

  if (!listing_id) {
    alert('No valid property ID found in the URL.');
    document.getElementById('propertyName').textContent = 'Invalid Property ID';
    return;
  }

  const property = await fetchPropertyDetails(listing_id);

  if (property) {
    // Set property name if available, otherwise set a default name
    document.getElementById('propertyName').textContent = property.name || 'Unnamed Property';
    document.getElementById('listingId').value = listing_id; // Store listing_id in hidden input
  } else {
    document.getElementById('propertyName').textContent = 'Property not found';
  }
}

// Step 4: Handle booking submission
document.getElementById('bookingForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent page reload

  const bookingDetails = {
    listing_id: document.getElementById('listingId').value,
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value,
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    daytimePhone: document.getElementById('daytimePhone').value, 
    phone: document.getElementById('phone').value,
    postalAddress: document.getElementById('postalAddress').value,
    homeAddress: document.getElementById('homeAddress').value,
  };

  console.log('Booking Details:', bookingDetails); // Verify in console

  // Check if all required fields are filled
  if (!bookingDetails.listing_id || !bookingDetails.startDate || 
      !bookingDetails.endDate || !bookingDetails.name || !bookingDetails.email) {
    alert('Please fill all required fields.');
    return;
  }

  try {
    // Send booking details to backend
    const response = await fetch('http://localhost:3000/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingDetails),
    });

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    const result = await response.json();
    console.log(`Booking confirmed! Your booking ID is: ${result.id}`);

    // Redirect to confirmation page with booking ID
    window.location.href = `/confirmation.html?booking_id=${result.id}`;
  } catch (error) {
    console.error('Error confirming booking:', error);
    alert('Failed to confirm booking. Please try again.');
  }
});

// Call the function to display property details on page load
window.onload = displayPropertyDetails;
