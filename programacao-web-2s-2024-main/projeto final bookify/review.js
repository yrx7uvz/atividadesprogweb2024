class ReviewSystem {
    constructor() {
        this.reviews = JSON.parse(localStorage.getItem('bookReviews')) || {};
        this.currentRating = 0;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Adicionar review ao clicar no botão de review
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('review-btn')) {
                const bookId = e.target.dataset.bookId;
                this.showReviewModal(bookId);
            }
        });

        // Configurar sistema de estrelas
        const stars = document.querySelectorAll('.star-rating i');
        stars.forEach(star => {
            star.addEventListener('mouseover', () => this.handleStarHover(star));
            star.addEventListener('mouseleave', () => this.handleStarLeave());
            star.addEventListener('click', () => this.handleStarClick(star));
        });

        // Manipular envio do formulário de review
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => this.handleReviewSubmit(e));
        }
    }

    showReviewModal(bookId) {
        const modal = document.getElementById('reviewModal');
        if (modal) {
            modal.style.display = 'block';
            modal.dataset.bookId = bookId;
            this.resetReviewForm();
    
            // Adicionando listener de clique no botão de fechar
            const closeBtn = modal.querySelector('.close');
            closeBtn.addEventListener('click', () => {
                this.hideReviewModal();
            });
    
            // Adicionar listener de clique fora do modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideReviewModal();
                }
            });
        }
    }

    resetReviewForm() {
        const form = document.getElementById('reviewForm');
        if (form) {
            form.reset();
            this.currentRating = 0;
            this.updateStarDisplay();
        }
    }

    handleStarHover(star) {
        const rating = parseInt(star.dataset.rating);
        this.updateStarDisplay(rating);
    }

    handleStarLeave() {
        this.updateStarDisplay(this.currentRating);
    }

    handleStarClick(star) {
        this.currentRating = parseInt(star.dataset.rating);
        this.updateStarDisplay(this.currentRating);
    }

    updateStarDisplay(rating = 0) {
        const stars = document.querySelectorAll('.star-rating i');
        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            star.classList.toggle('active', starRating <= rating);
        });
    }

    handleReviewSubmit(e) {
        e.preventDefault();
        const modal = document.getElementById('reviewModal');
        const bookId = modal.dataset.bookId;
        const reviewText = e.target.querySelector('textarea').value;

        if (!this.currentRating) {
            alert('Por favor, selecione uma classificação');
            return;
        }

        if (!reviewText.trim()) {
            alert('Por favor, escreva um comentário');
            return;
        }

        this.addReview(bookId, {
            rating: this.currentRating,
            text: reviewText,
            date: new Date().toISOString(),
            userId: currentUser?.id || 'anonymous',
            userName: currentUser?.name || 'Anônimo'
        });

        modal.style.display = 'none';
        this.resetReviewForm();
        this.updateBookDisplay(bookId);
    }

    addReview(bookId, review) {
        if (!this.reviews[bookId]) {
            this.reviews[bookId] = [];
        }
        this.reviews[bookId].push(review);
        localStorage.setItem('bookReviews', JSON.stringify(this.reviews));
    }

    getBookReviews(bookId) {
        return this.reviews[bookId] || [];
    }

    calculateAverageRating(bookId) {
        const reviews = this.getBookReviews(bookId);
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }

    updateBookDisplay(bookId) {
        const bookCard = document.querySelector(`[data-book-id="${bookId}"]`).closest('.book-card');
        if (bookCard) {
            const ratingDisplay = bookCard.querySelector('.book-rating span');
            if (ratingDisplay) {
                ratingDisplay.textContent = `(${this.calculateAverageRating(bookId)})`;
            }
            this.displayReviews(bookId);
        }
    }

    displayReviews(bookId) {
        const reviewsList = document.querySelector(`[data-book-id="${bookId}"] .reviews-list`);
        if (!reviewsList) return;

        const reviews = this.getBookReviews(bookId);
        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.userName}</span>
                    <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div class="review-rating">
                    ${this.generateStarRating(review.rating)}
                </div>
                <div class="review-content">
                    ${review.text}
                </div>
            </div>
        `).join('');
    }

    generateStarRating(rating) {
        return Array(5).fill(0).map((_, i) => `
            <i class="fas fa-star ${i < rating ? 'active' : ''}"></i>
        `).join('');
    }
}

// Inicializar o sistema de reviews
const reviewSystem = new ReviewSystem();