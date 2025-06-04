// Wait for the DOM to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const homeLink = document.getElementById('home-link');
    const aboutLink = document.getElementById('about-link');
    const contactLink = document.getElementById('contact-link');
    const homeSection = document.getElementById('home-section');
    const aboutSection = document.getElementById('about-section');
    const contactSection = document.getElementById('contact-section');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const recommendationsSection = document.getElementById('recommendations-section');
    const resultsContainer = document.getElementById('results-container');
    const contactForm = document.getElementById('contact-form');
    const bookNowBtn = document.querySelector('.book-now');

    // Initialize the page - show home section by default
    homeSection.classList.remove('hidden');
    aboutSection.classList.add('hidden');
    contactSection.classList.add('hidden');
    recommendationsSection.classList.add('hidden');

    // Navigation functionality
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        homeSection.classList.remove('hidden');
        aboutSection.classList.add('hidden');
        contactSection.classList.add('hidden');
        recommendationsSection.classList.add('hidden');
        window.scrollTo(0, 0);
    });

    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        homeSection.classList.add('hidden');
        aboutSection.classList.remove('hidden');
        contactSection.classList.add('hidden');
        window.scrollTo(0, 0);
    });

    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        homeSection.classList.add('hidden');
        aboutSection.classList.add('hidden');
        contactSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    });

    // Search functionality
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            alert('Please enter a search term (beach, temple, or country)');
            return;
        }
        
        fetchRecommendations(searchTerm);
    });

    // Allow search on Enter key press
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm === '') {
                alert('Please enter a search term (beach, temple, or country)');
                return;
            }
            
            fetchRecommendations(searchTerm);
        }
    });

    // Clear button functionality
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        recommendationsSection.classList.add('hidden');
        searchInput.focus();
    });

    // Book Now button functionality
    bookNowBtn.addEventListener('click', function() {
        alert('Booking functionality would be implemented here in a real application!');
    });

    // Contact form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // In a real application, you would send this data to a server
        alert(`Thank you for your message, ${name}! We'll get back to you soon at ${email}.`);
        
        // Reset the form
        contactForm.reset();
    });

    // Fetch recommendations from JSON
    async function fetchRecommendations(searchTerm) {
        try {
            // Show loading state
            resultsContainer.innerHTML = '<p>Loading recommendations...</p>';
            recommendationsSection.classList.remove('hidden');
            
            const response = await fetch('https://github.com/thomaskoh1982/travelrecommendation/blob/main/travel_recommendation_api.json');
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            let filteredResults = [];
            
            // Check for different keyword variations
            if (searchTerm.includes('beach') || searchTerm === 'beaches') {
                filteredResults = data.beaches;
            } else if (searchTerm.includes('temple') || searchTerm === 'temples') {
                filteredResults = data.temples;
            } else if (searchTerm.includes('country') || searchTerm === 'countries') {
                filteredResults = data.countries;
            } else {
                // If no direct match, search in all categories
                filteredResults = [
                    ...data.beaches.filter(item => 
                        item.name.toLowerCase().includes(searchTerm) || 
                        item.description.toLowerCase().includes(searchTerm)
                    ),
                    ...data.temples.filter(item => 
                        item.name.toLowerCase().includes(searchTerm) || 
                        item.description.toLowerCase().includes(searchTerm)
                    ),
                    ...data.countries.filter(item => 
                        item.name.toLowerCase().includes(searchTerm) || 
                        item.description.toLowerCase().includes(searchTerm)
                    )
                ];
            }
            
            displayResults(filteredResults);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            resultsContainer.innerHTML = '<p>Error loading recommendations. Please try again later.</p>';
            recommendationsSection.classList.remove('hidden');
        }
    }

    // Display results
    function displayResults(results) {
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found. Try searching for "beach", "temple", or "country".</p>';
            recommendationsSection.classList.remove('hidden');
            return;
        }
        
        resultsContainer.innerHTML = '';
        
        results.forEach(result => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            
            card.innerHTML = `
                <img src="${result.imageUrl}" alt="${result.name}" class="card-image">
                <div class="card-content">
                    <h3>${result.name}</h3>
                    <p>${result.description}</p>
                </div>
            `;
            
            resultsContainer.appendChild(card);
        });
        
        recommendationsSection.classList.remove('hidden');
        window.scrollTo({
            top: recommendationsSection.offsetTop,
            behavior: 'smooth'
        });
    }
});