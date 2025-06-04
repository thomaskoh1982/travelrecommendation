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

// Navigation functionality
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    homeSection.classList.remove('hidden');
    aboutSection.classList.add('hidden');
    contactSection.classList.add('hidden');
    recommendationsSection.classList.add('hidden');
});

aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    homeSection.classList.add('hidden');
    aboutSection.classList.remove('hidden');
    contactSection.classList.add('hidden');
});

contactLink.addEventListener('click', (e) => {
    e.preventDefault();
    homeSection.classList.add('hidden');
    aboutSection.classList.add('hidden');
    contactSection.classList.remove('hidden');
});

// Search functionality
searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        alert('Please enter a search term');
        return;
    }
    
    fetchRecommendations(searchTerm);
});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    recommendationsSection.classList.add('hidden');
});

// Contact form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // In a real application, you would send this data to a server
    alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
    
    // Reset the form
    contactForm.reset();
});

// Fetch recommendations from JSON
async function fetchRecommendations(searchTerm) {
    try {
        const response = await fetch('travel_recommendation_api.json');
        const data = await response.json();
        
        let filteredResults = [];
        
        // Check for different keyword variations
        if (searchTerm.includes('beach') || searchTerm === 'beaches') {
            filteredResults = data.beaches;
        } else if (searchTerm.includes('temple') || searchTerm === 'temples') {
            filteredResults = data.temples;
        } else if (searchTerm.includes('country') || searchTerm === 'countries')) {
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
        alert('An error occurred while fetching recommendations. Please try again.');
    }
}

// Display results
function displayResults(results) {
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found. Try a different search term.</p>';
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
}