// On page load, display random listings and hide the listings count initially
window.onload = async () => {
  try {
    const response = await fetch('/listings/random'); // Use correct route for random listings
    const listings = await response.json();
    displayListings(listings, false); // Hide listings count on initial load
  } catch (error) {
    console.error('Error fetching random listings:', error);
    document.getElementById('listings').innerHTML = '<p>Failed to load listings. Please try again later.</p>';
  }
};

// Form submission handler
document.getElementById('filterForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const location = document.getElementById('location').value;
  const propertyType = document.getElementById('propertyType').value;
  const bedrooms = document.getElementById('bedrooms').value;

  const params = new URLSearchParams({
    location,
    ...(propertyType && { propertyType }), // Include only if propertyType is selected
    ...(bedrooms && { bedrooms }) // Include only if bedrooms is selected
  }).toString();

  try {
    const response = await fetch(`/listings?${params}`); // Fetch filtered listings
    const listings = await response.json();
    displayListings(listings, true); // Show listings count after search
  } catch (error) {
    console.error('Error fetching listings:', error);
    document.getElementById('listings').innerHTML = '<p>Failed to load listings. Please try again later.</p>';
  }
});

// Function to display listings and optionally show the count
function displayListings(listings, showCount) {
  const listingsCount = listings.length;
  const listingsDiv = document.getElementById('listings');
  const listingsCountElement = document.getElementById('listingsCount');

  // Update and show/hide the listings count
  if (showCount) {
    listingsCountElement.textContent = `${listingsCount} Listings that match your preferences`;
    listingsCountElement.style.display = 'block';
  } else {
    listingsCountElement.style.display = 'none'; // Hide count on initial load
  }

  // If no listings are found, show a message
  if (listings.length === 0) {
    listingsDiv.innerHTML = '<p>No listings found for the given criteria.</p>';
    return;
  }

  // Render property listings dynamically
  listingsDiv.innerHTML = listings.map(listing => `
    <div class="col-12">
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">
            <a href="/bookings.html?listing_id=${listing._id}" 
               class="text-decoration-none text-dark fw-bold">
              ${listing.name}
            </a>
          </h5>
          <p class="card-summary">${listing.summary || 'No summary available.'}</p>
          <div class="property-details">
            <p><i class="fas fa-building"></i> <strong>Property Type:</strong> ${listing.property_type || 'N/A'}</p>
            <p><i class="fas fa-home"></i> <strong>Room Type:</strong> ${listing.room_type || 'N/A'}</p>
            <p><i class="fas fa-dollar-sign"></i> <strong>Price:</strong> $${listing.price?.toFixed(2) || 'N/A'}</p>
            <p><i class="fas fa-users"></i> <strong>Accommodates:</strong> ${listing.accommodates || 'N/A'}</p>
            <p><i class="fas fa-star"></i> <strong>Rating:</strong> ${listing.review_scores?.review_scores_rating || 'Not Rated'}</p>
          </div>
          <div class="text-end mt-3">
            <a href="/bookings.html?listing_id=${listing._id}" class="btn btn-primary book-now-btn">
              Book Now
            </a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}
