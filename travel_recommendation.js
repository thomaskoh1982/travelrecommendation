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

    // Detect mobile device
    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || 
               (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    // Navigation functionality
    function navigateTo(section) {
        homeSection.classList.add('hidden');
        aboutSection.classList.add('hidden');
        contactSection.classList.add('hidden');
        recommendationsSection.classList.add('hidden');
        
        section.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        navigateTo(homeSection);
    });

    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        navigateTo(aboutSection);
    });

    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        navigateTo(contactSection);
    });

    // Search functionality
    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            alert('Please enter a search term (beach, temple, or country)');
            return;
        }
        
        fetchRecommendations(searchTerm);
    }

    // Click/touch events for search
    searchBtn.addEventListener('click', handleSearch);
    searchBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        handleSearch();
    });

    // Enter key press for search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Clear button functionality
    function clearSearch() {
        searchInput.value = '';
        recommendationsSection.classList.add('hidden');
        searchInput.focus();
    }

    clearBtn.addEventListener('click', clearSearch);
    clearBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        clearSearch();
    });

    // Handle keyboard dismissal on mobile
    searchInput.addEventListener('blur', function() {
        if (isMobileDevice()) {
            window.scrollTo(0, 0);
        }
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
        
        alert(`Thank you for your message, ${name}! We'll get back to you soon at ${email}.`);
        contactForm.reset();
    });

    // Fetch recommendations from JSON
    async function fetchRecommendations(searchTerm) {
        try {
            // Show loading state with mobile-specific message if needed
            if (isMobileDevice()) {
                resultsContainer.innerHTML = `
                    <div class="loading-spinner"></div>
                    <p>Loading recommendations for mobile...</p>
                `;
            } else {
                resultsContainer.innerHTML = '<div class="loading-spinner"></div><p>Loading recommendations...</p>';
            }
            
            recommendationsSection.classList.remove('hidden');
            
            // Try fetching from GitHub first, then fall back to local file
            let response;
            try {
                response = await fetch('https://raw.githubusercontent.com/thomaskoh1982/travelrecommendation/main/travel_recommendation_api.json', {
                    cache: 'no-cache'
                });
                
                if (!response.ok) throw new Error('GitHub fetch failed');
            } catch (githubError) {
                console.log('Falling back to local file');
                response = await fetch('travel_recommendation_api.json');
            }
            
            if (!response.ok) {
                throw new Error('Failed to load recommendations data');
            }
            
            const data = await response.json();
            const filteredResults = filterResults(data, searchTerm);
            displayResults(filteredResults);
        } catch (error) {
            console.error('Error:', error);
            
            let errorMessage = 'Error loading recommendations. Please try again later.';
            if (isMobileDevice()) {
                errorMessage += '\n(Mobile device detected)';
            }
            
            resultsContainer.innerHTML = `
                <p>${errorMessage}</p>
                <p>${error.message}</p>
                <button onclick="window.location.reload()" style="
                    padding: 10px 20px;
                    background: #f39c12;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    margin-top: 10px;
                ">Retry</button>
            `;
            
            recommendationsSection.classList.remove('hidden');
        }
    }

    // Filter results based on search term
    function filterResults(data, searchTerm) {
        if (searchTerm.includes('beach') || searchTerm === 'beaches') {
            return data.beaches;
        } else if (searchTerm.includes('temple') || searchTerm === 'temples') {
            return data.temples;
        } else if (searchTerm.includes('country') || searchTerm === 'countries') {
            return data.countries;
        }
        
        // Search across all categories if no direct match
        return [
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
                <img src="${result.imageUrl}" alt="${result.name}" class="card-image" loading="lazy">
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