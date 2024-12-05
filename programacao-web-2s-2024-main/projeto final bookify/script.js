// elementos do DOM
const searchInput = document.getElementById('searchInput');
const searchButton = document.querySelector('.search-container button');
const featuredBooks = document.getElementById('featuredBooks');
let searchTimeout;

// eventos de busca
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchBooks(e.target.value);
    }, 500); 
});

searchButton.addEventListener('click', () => {
    searchBooks(searchInput.value);
});

// busca usando a API do google books
async function searchBooks(query) {
    if (!query.trim()) {
        displayDefaultBooks();
        return;
    }

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    featuredBooks.innerHTML = '';
    featuredBooks.appendChild(loadingDiv);

    try {
        const books = await BookAPI.searchBooks(query);
        displayBooks(books);
    } catch (error) {
        console.error('Erro na busca:', error);
        featuredBooks.innerHTML = '<p>Erro ao buscar livros. Tente novamente.</p>';
    }
}

// exibir livros
function displayBooks(books) {
    featuredBooks.innerHTML = '';
    
    if (books.length === 0) {
        featuredBooks.innerHTML = '<p>Nenhum livro encontrado.</p>';
        return;
    }

    books.forEach(book => {
        const bookCard = createBookCard(book);
        featuredBooks.appendChild(bookCard);
    });
}

// card do livro
function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.innerHTML = `
        <img src="${book.cover}" alt="${book.title}" 
             onerror="this.src='/img/default-book.jpg'"
             loading="lazy">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <div class="book-rating">
            ${generateStarRating(book.rating)}
            <span>(${book.rating || 'Sem avaliação'})</span>
        </div>
        <button class="review-btn" data-book-id="${book.id}">
            <i class="fas fa-star"></i> Escrever Review
        </button>
        <button class="details-btn" onclick="showBookDetails('${book.id}')">
            <i class="fas fa-info-circle"></i> Detalhes
        </button>
    `;

    return bookCard;
}

// classificação em estrelas
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// detalhes do livro
async function showBookDetails(bookId) {
    try {
        const book = await BookAPI.getBookDetails(bookId);
        if (!book) throw new Error('Livro não encontrado');

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content book-details">
                <span class="close">&times;</span>
                <div class="book-details-content">
                    <div class="book-cover">
                        <img src="${book.cover}" alt="${book.title}">
                    </div>
                    <div class="book-info">
                        <h2>${book.title}</h2>
                        <p class="author">por ${book.author}</p>
                        <p class="rating">${generateStarRating(book.rating)} (${book.rating || 'Sem avaliação'})</p>
                        <p class="description">${book.description}</p>
                        <div class="additional-info">
                            <p><strong>Data de Publicação:</strong> ${book.publishedDate || 'N/A'}</p>
                            <p><strong>Páginas:</strong> ${book.pageCount || 'N/A'}</p>
                            <p><strong>Categorias:</strong> ${book.categories.join(', ') || 'N/A'}</p>
                        </div>
                        <a href="${book.previewLink}" target="_blank" class="preview-link">
                            <button class="preview-btn">
                                <i class="fas fa-book-open"></i> Visualizar no Google Books
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    } catch (error) {
        console.error('Erro ao carregar detalhes do livro:', error);
        alert('Erro ao carregar detalhes do livro. Tente novamente.');
    }
}

// carregar livros iniciais
function displayDefaultBooks() {
    const defaultQueries = ['best sellers', 'classic literature', 'award winning books'];
    const randomQuery = defaultQueries[Math.floor(Math.random() * defaultQueries.length)];
    searchBooks(randomQuery);
}

// abrir o modal de login
const loginButton = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');

if (loginButton) {
    loginButton.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
}

//abrir o modal de review
const reviewButtons = document.querySelectorAll('.review-btn');
reviewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const bookId = e.target.dataset.bookId;
        reviewSystem.showReviewModal(bookId);
    });
});


// fechar os modais de login e registro
const modalCloseButtons = document.querySelectorAll('.modal .close');
modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        modal.style.display = 'none';
    });
});

// fechar os modais ao clicar fora deles
window.addEventListener('click', (event) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
// inicializa
displayDefaultBooks();