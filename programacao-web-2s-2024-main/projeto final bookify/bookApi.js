// chave api google books
const API_KEY = 'AIzaSyB5q6zpdANjCd1YjkCRJck-Xoqrp0E-iWg';
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

class BookAPI {
    static async searchBooks(query) {
        try {
            const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(query)}&key=${API_KEY}`);
            const data = await response.json();
            
            if (!data.items) return [];

            return data.items.map(book => ({
                id: book.id,
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Autor Desconhecido',
                cover: book.volumeInfo.imageLinks?.thumbnail || '/img/default-book.jpg',
                description: book.volumeInfo.description || 'Sem descrição disponível',
                rating: book.volumeInfo.averageRating || 0,
                publishedDate: book.volumeInfo.publishedDate,
                pageCount: book.volumeInfo.pageCount,
                categories: book.volumeInfo.categories || [],
                language: book.volumeInfo.language
            }));
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            return [];
        }
    }

    static async getBookDetails(bookId) {
        try {
            const response = await fetch(`${BASE_URL}/${bookId}?key=${API_KEY}`);
            const book = await response.json();

            return {
                id: book.id,
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Autor Desconhecido',
                cover: book.volumeInfo.imageLinks?.thumbnail || '/img/default-book.jpg',
                description: book.volumeInfo.description || 'Sem descrição disponível',
                rating: book.volumeInfo.averageRating || 0,
                publishedDate: book.volumeInfo.publishedDate,
                pageCount: book.volumeInfo.pageCount,
                categories: book.volumeInfo.categories || [],
                language: book.volumeInfo.language,
                previewLink: book.volumeInfo.previewLink
            };
        } catch (error) {
            console.error('Erro ao buscar detalhes do livro:', error);
            return null;
        }
    }
}