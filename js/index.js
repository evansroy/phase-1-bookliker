const bookList = document.querySelector('#list');
const bookDetails = document.querySelector('#show-panel');

// Fetch the list of books
fetch('http://localhost:3000/books')
  .then(response => response.json())
  .then(books => {
    // Create an li for each book and add it to the ul#list element
    books.forEach(book => {
      const bookLi = document.createElement('li');
      bookLi.innerText = book.title;
      bookList.appendChild(bookLi);

      // Add an event listener to display the book's details when the title is clicked
      bookLi.addEventListener('click', () => {
        // Display the book's thumbnail, description, a list of users who have liked the book, and a like button
        bookDetails.innerHTML = `
          <h2>${book.title}</h2>
          <img src="${book.img_url}" alt="${book.title}">
          <p>${book.description}</p>
          <ul>${book.users.map(user => `<li>${user.username}</li>`).join('')}</ul>
          <button id="like-btn">Like</button>
        `;

        const likeBtn = bookDetails.querySelector('#like-btn');

        // Add an event listener to the like button
        likeBtn.addEventListener('click', () => {
          // Add the current user to the list of users who have liked the book
          const currentUser = {"id": 1, "username": "pouros"}; // replace with actual user data
          const newUsers = [...book.users, currentUser];

          // Send a PATCH request to update the list of users who have liked the book
          fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ users: newUsers })
          })
          .then(response => response.json())
          .then(updatedBook => {
            // Update the book details section with the updated list of users who have liked the book
            bookDetails.innerHTML = `
              <h2>${updatedBook.title}</h2>
              <img src="${updatedBook.img_url}" alt="${updatedBook.title}">
              <p>${updatedBook.description}</p>
              <ul>${updatedBook.users.map(user => `<li>${user.username}</li>`).join('')}</ul>
              <button id="like-btn">Like</button>
            `;
          })
          .catch(error => {
            console.error('Error updating book:', error);
          });
        });
      });
    });
  });
