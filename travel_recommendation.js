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

    // Initialize the page
    function initPage() {
        homeSection.classList.remove('hidden');
        aboutSection.classList.add('hidden');
        contactSection.classList.add('hidden');
        recommendationsSection.classList.add('hidden');
    }
    initPage();

    // Mobile detection with more reliable checks
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Navigation controller
    function navigateTo(section) {
        [homeSection, aboutSection, contactSection, recommendationsSection].forEach(sec => {
            sec.classList.add('hidden');
        });
        section.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    // Event listeners for navigation
    [homeLink, aboutLink, contactLink].forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.id.replace('-link', '-section');
            navigateTo(document.getElementById(target));
        });
        
        // Add touch support for mobile
        link.addEventListener('touchend', function(e) {
            e.preventDefault();
            const target = this.id.replace('-link', '-section');
            navigateTo(document.getElementById(target));
        });
    });

    // Search functionality
    async function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            alert('Please enter a search term (beach, temple, or country)');
            return;
        }
        
        try {
            // Show loading state
            resultsContainer.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Loading recommendations...</p>
            `;
            recommendationsSection.classList.remove('hidden');
            
            // First try to load the local JSON file directly
            let data;
            try {
                const response = await fetch('travel_recommendation_api.json');
                if (!response.ok) throw new Error('Local fetch failed');
                data = await response.json();
            } catch (localError) {
                console.log('Local fetch failed, trying GitHub');
                // If local fails, try GitHub (mobile browsers often block local file access)
                const githubResponse = await fetch('https://raw.githubusercontent.com/thomaskoh1982/travelrecommendation/main/travel_recommendation_api.json');
                if (!githubResponse.ok) throw new Error('GitHub fetch failed');
                data = await githubResponse.json();
            }
            
            // Filter and display results
            const filteredResults = filterResults(data, searchTerm);
            displayResults(filteredResults);
        } catch (error) {
            console.error('Search error:', error);
            resultsContainer.innerHTML = `
                <p>Couldn't load recommendations.</p>
                <p>${isMobileDevice() ? 'Mobile ' : ''}Error: ${error.message}</p>
                <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
            `;
            recommendationsSection.classList.remove('hidden');
        }
    }

    // Search event handlers
    searchBtn.addEventListener('click', handleSearch);
    searchBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        handleSearch();
    });

    // Enter key search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });

    // Clear search
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

    // Mobile keyboard handling
    if (isMobileDevice()) {
        searchInput.addEventListener('blur', function() {
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        });
    }

    // Book Now button
    bookNowBtn.addEventListener('click', function() {
        alert('Booking system would connect here!');
    });

    // Contact form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        alert(`Thank you, ${name}! We'll contact you at ${email}.`);
        contactForm.reset();
    });

    // Filter results
    function filterResults(data, searchTerm) {
        const searchWords = searchTerm.split(' ');
        
        // First check for exact category matches
        if (searchTerm.includes('beach') || searchTerm === 'beaches') {
            return data.beaches;
        }
        if (searchTerm.includes('temple') || searchTerm === 'temples') {
            return data.temples;
        }
        if (searchTerm.includes('country') || searchTerm === 'countries') {
            return data.countries;
        }
        
        // Search across all categories
        return [
            ...data.beaches.filter(item => 
                searchWords.some(word => 
                    item.name.toLowerCase().includes(word) || 
                    item.description.toLowerCase().includes(word)
                )
            ),
            ...data.temples.filter(item => 
                searchWords.some(word => 
                    item.name.toLowerCase().includes(word) || 
                    item.description.toLowerCase().includes(word)
                )
            ),
            ...data.countries.filter(item => 
                searchWords.some(word => 
                    item.name.toLowerCase().includes(word) || 
                    item.description.toLowerCase().includes(word)
                )
            )
        ];
    }

    // Display results
    function displayResults(results) {
        if (!results.length) {
            resultsContainer.innerHTML = `
                <p>No results found.</p>
                <p>Try: "beach", "temple", or "country"</p>
            `;
            recommendationsSection.classList.remove('hidden');
            return;
        }
        
        resultsContainer.innerHTML = '';
        
        results.forEach(result => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            
            // Create image with error handling
            const img = document.createElement('img');
            img.src = result.imageUrl;
            img.alt = result.name;
            img.className = 'card-image';
            img.loading = 'lazy';
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
            };
            
            const content = document.createElement('div');
            content.className = 'card-content';
            content.innerHTML = `
                <h3>${result.name}</h3>
                <p>${result.description}</p>
            `;
            
            card.appendChild(img);
            card.appendChild(content);
            resultsContainer.appendChild(card);
        });
        
        recommendationsSection.classList.remove('hidden');
        window.scrollTo({
            top: recommendationsSection.offsetTop,
            behavior: 'smooth'
        });
    }
});