document.addEventListener('DOMContentLoaded', () => {
    // Sticky Navigation
    const navbar = document.getElementById('navbar');
    
    const isHomePage = document.querySelector('.hero') !== null;
    
    // Add scrolled class on page load if not at top, or if not home page
    if (window.scrollY > 50 || !isHomePage) {
        navbar.classList.add('scrolled');
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50 || !isHomePage) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            hamburger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });

    // Set Active Link based on URL
    let currentPage = window.location.pathname.split('/').pop() || 'index.html';
    // Handle root / case in Vite
    if (currentPage === '') currentPage = 'index.html';
    
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    // Tab Switching Logic for Reviews Page
    const btnReadReviews = document.getElementById('btnReadReviews');
    const btnWriteReview = document.getElementById('btnWriteReview');
    const readReviewsTab = document.getElementById('readReviewsTab');
    const writeReviewTab = document.getElementById('writeReviewTab');
    const toggleIndicator = document.getElementById('toggleIndicator');

    if (btnReadReviews && btnWriteReview && toggleIndicator) {
        btnReadReviews.addEventListener('click', () => {
            toggleIndicator.style.transform = 'translateX(0)';
            
            btnReadReviews.style.color = 'var(--dark-bg)';
            btnWriteReview.style.color = 'var(--white)';
            
            readReviewsTab.style.display = 'block';
            writeReviewTab.style.display = 'none';
        });

        btnWriteReview.addEventListener('click', () => {
            toggleIndicator.style.transform = 'translateX(100%)';
            
            btnWriteReview.style.color = 'var(--dark-bg)';
            btnReadReviews.style.color = 'var(--white)';
            
            writeReviewTab.style.display = 'block';
            readReviewsTab.style.display = 'none';
        });
    }


    // Review Form Handling
    const reviewForm = document.getElementById('reviewForm');
    const reviewsGrid = document.getElementById('reviewsGrid');
    let currentlyEditingCard = null;

    function saveCustomReviews() {
        if (!reviewsGrid) return;
        const customCards = Array.from(reviewsGrid.querySelectorAll('.review-card')).filter(card => card.querySelector('.edit-review-btn'));
        const reviewsData = customCards.map(card => ({
            name: card.querySelector('h4').textContent,
            rating: card.dataset.rating,
            text: card.querySelector('.review-text').textContent
        }));
        localStorage.setItem('shreeBalajiReviews', JSON.stringify(reviewsData));
    }

    function createReviewCard(name, rating, text) {
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                starsHtml += '<i class="fa-solid fa-star"></i>';
            } else {
                starsHtml += '<i class="fa-regular fa-star" style="color: #ddd;"></i>';
            }
        }
        
        const avatarLetter = name.charAt(0).toUpperCase();
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.dataset.rating = rating;
        reviewCard.innerHTML = `
            <div class="reviewer" style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div class="avatar" style="background-color: var(--secondary-color); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">${avatarLetter}</div>
                    <div class="reviewer-info">
                        <h4 style="margin: 0; font-size: 1rem; color: #202124;">${name}</h4>
                        <span style="font-size: 0.85rem; color: #70757a;">1 review</span>
                    </div>
                </div>
                <i class="fa-solid fa-ellipsis-vertical" style="color: #5f6368; cursor: pointer; padding: 5px;"></i>
            </div>
            <div class="stars" style="display: flex; align-items: center; margin-bottom: 8px;">
                <div class="stars-container" style="margin-right: 8px; font-size: 0.9rem; color: #fbbc04;">
                    ${starsHtml}
                </div>
                <span style="font-size: 0.85rem; color: #70757a;">just now</span>
            </div>
            <p class="review-text" style="margin-bottom: 15px; color: #3c4043; font-size: 0.95rem; line-height: 1.5;">${text}</p>
            <div class="review-actions-bottom" style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button style="background: none; border: 1px solid #dadce0; border-radius: 16px; padding: 5px 12px; color: #3c4043; font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; gap: 6px; cursor: pointer;"><i class="fa-regular fa-thumbs-up"></i> Helpful</button>
                <button style="background: none; border: 1px solid #dadce0; border-radius: 16px; padding: 5px 12px; color: #3c4043; font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; gap: 6px; cursor: pointer;"><i class="fa-solid fa-share-nodes"></i> Share</button>
                <button class="btn edit-review-btn" style="background-color: #e0f7fa; color: #00838f; border: none; padding: 5px 12px; border-radius: 16px; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
            </div>
        `;
        
        const editBtn = reviewCard.querySelector('.edit-review-btn');
        editBtn.addEventListener('click', () => {
            if(!document.getElementById('reviewerName')) return; // sanity check
            document.getElementById('reviewerName').value = reviewCard.querySelector('h4').textContent;
            document.getElementById('reviewRating').value = reviewCard.dataset.rating;
            document.getElementById('reviewText').value = reviewCard.querySelector('.review-text').textContent;
            currentlyEditingCard = reviewCard;
            document.querySelector('#reviewForm button[type="submit"]').textContent = "Update Review";
            if(btnWriteReview) btnWriteReview.click();
            document.getElementById('reviewForm').scrollIntoView({ behavior: 'smooth' });
        });

        return reviewCard;
    }

    function loadCustomReviews() {
        if (!reviewsGrid) return;
        const saved = localStorage.getItem('shreeBalajiReviews');
        if (saved) {
            const data = JSON.parse(saved);
            // Insert backwards so index 0 stays at top
            for (let i = data.length - 1; i >= 0; i--) {
                const card = createReviewCard(data[i].name, parseInt(data[i].rating), data[i].text);
                reviewsGrid.insertBefore(card, reviewsGrid.firstChild);
            }
        }
    }

    if (reviewForm) {
        loadCustomReviews();

        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('reviewerName').value;
            const rating = parseInt(document.getElementById('reviewRating').value);
            const text = document.getElementById('reviewText').value;
            
            if (currentlyEditingCard) {
                // Update existing card
                let starsHtml = '';
                for (let i = 0; i < 5; i++) {
                    if (i < rating) starsHtml += '<i class="fa-solid fa-star"></i>';
                    else starsHtml += '<i class="fa-regular fa-star" style="color: #ddd;"></i>';
                }
                currentlyEditingCard.querySelector('h4').textContent = name;
                currentlyEditingCard.querySelector('.avatar').textContent = name.charAt(0).toUpperCase();
                currentlyEditingCard.querySelector('.review-text').textContent = text;
                currentlyEditingCard.querySelector('.stars-container').innerHTML = starsHtml;
                currentlyEditingCard.dataset.rating = rating;
                
                currentlyEditingCard = null;
                document.querySelector('#reviewForm button[type="submit"]').textContent = "Submit Review";
                
                saveCustomReviews();
                if(btnReadReviews) btnReadReviews.click();
                alert('Your review has been updated!');
            } else {
                // Create new card
                const card = createReviewCard(name, rating, text);
                reviewsGrid.insertBefore(card, reviewsGrid.firstChild);
                saveCustomReviews();
                
                if(btnReadReviews) btnReadReviews.click();
                alert('Thank you for your review!');
            }
            
            reviewForm.reset();
        });
    }
    // ==========================================
    // GOOGLE MAPS REVIEWS AUTO-SYNC INTEGRATION
    // ==========================================
    const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // Ikkada mee Google API Key ivvali
    const PLACE_ID = "YOUR_SHOP_PLACE_ID"; // Ikkada mee Shop Google Place ID ivvali

    async function syncGoogleReviews() {
        if (GOOGLE_API_KEY === "YOUR_GOOGLE_API_KEY") {
            console.log("Waiting for Google API Key to activate live sync.");
            return;
        }

        try {
            // Fetch live reviews from Google Places API
            const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=reviews&key=${GOOGLE_API_KEY}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (data.reviews) {
                const reviewsGrid = document.getElementById('reviewsGrid');
                
                data.reviews.forEach(review => {
                    const name = review.authorAttribution.displayName;
                    const rating = review.rating;
                    const text = review.text ? review.text.text : '';
                    const profilePhoto = review.authorAttribution.photoUri;
                    const relativeTime = review.relativePublishTimeDescription;

                    let starsHtml = '';
                    for (let i = 0; i < 5; i++) {
                        starsHtml += (i < rating) ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star" style="color: #ddd;"></i>';
                    }

                    const reviewCard = document.createElement('div');
                    reviewCard.className = 'review-card';
                    reviewCard.innerHTML = `
                        <div class="reviewer" style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <img src="${profilePhoto}" alt="${name}" style="width: 40px; height: 40px; border-radius: 50%;">
                                <div class="reviewer-info">
                                    <h4 style="margin: 0; font-size: 1rem; color: #202124;">${name}</h4>
                                    <span style="font-size: 0.85rem; color: #70757a;">Google Maps Review</span>
                                </div>
                            </div>
                            <i class="fa-solid fa-ellipsis-vertical" style="color: #5f6368; cursor: pointer; padding: 5px;"></i>
                        </div>
                        <div class="stars" style="display: flex; align-items: center; margin-bottom: 8px;">
                            <div class="stars-container" style="margin-right: 8px; font-size: 0.9rem; color: #fbbc04;">
                                ${starsHtml}
                            </div>
                            <span style="font-size: 0.85rem; color: #70757a;">${relativeTime}</span>
                            <i class="fa-brands fa-google" style="color: #4285F4; margin-left: 10px;"></i>
                        </div>
                        <p class="review-text" style="margin-bottom: 15px; color: #3c4043; font-size: 0.95rem; line-height: 1.5;">"${text}"</p>
                        <div class="review-actions-bottom" style="display: flex; gap: 20px;">
                            <button style="background: none; border: 1px solid #dadce0; border-radius: 16px; padding: 5px 12px; color: #3c4043; font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; gap: 6px; cursor: pointer;"><i class="fa-regular fa-thumbs-up"></i> Helpful</button>
                            <button style="background: none; border: 1px solid #dadce0; border-radius: 16px; padding: 5px 12px; color: #3c4043; font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; gap: 6px; cursor: pointer;"><i class="fa-solid fa-share-nodes"></i> Share</button>
                        </div>
                    `;
                    
                    // Insert at the top
                    reviewsGrid.insertBefore(reviewCard, reviewsGrid.firstChild);
                });
            }
        } catch (error) {
            console.error("Error fetching Google Reviews:", error);
        }
    }

    if (document.getElementById('reviewsGrid')) {
        syncGoogleReviews();
    }

});
