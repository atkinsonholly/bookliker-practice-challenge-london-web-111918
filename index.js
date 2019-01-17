document.addEventListener("DOMContentLoaded", function() {

  const bookList = document.querySelector('#list');
  const showPanel = document.querySelector('#show-panel');

  document.addEventListener("click", addImage)
  document.addEventListener("click", addLike)
  document.addEventListener("click", removeLike)

  function getBooks() {
    fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(json => json.forEach(insertBook))
  }

  function insertBook(book) {
    bookList.innerHTML +=
    `
    <div class="book-list">
      <div class="book-frame">
        <h1 id=${book.id} class="book-title">${book.title}</h1>
        <div id=${book.id} style="display: flex; justify-content: space-between; padding: 7px;">
        </div>
      </div>
    </div>`
  }

  function addImage(event){
    let bookTitle = event.target;
    let clicked = event.target.id;
    if (bookTitle.className === "book-title") {
      let book = findBook(clicked);
      insertDetails(book)
    }
  }

  function findBook(id){
    return fetch(`http://localhost:3000/books/${id}`)
      .then(res => res.json())
  }

  function insertDetails(book) {
    book.then(insertHTML)
  }

  function insertHTML(book){
    showPanel.innerHTML = ""
    showPanel.innerHTML +=
    `
      <div>
        <img class=book-id id=${book.id} src=${book.img_url}>
        <p>${book.description}</p>
        <p>Liked by: ${book.users.map(user => user.username).join(', ')}</p>
        <div>
          <button class="like-btn">Like this book!</btn>
        </div>
        <div>
          <button class="unlike-btn">Remove last like!</btn>
        </div>
      </div>
    `
  }

  function addLike(event){
    let liked = event.target;
    if (liked.className === "like-btn") {
      let clicked = event.target.parentElement.parentElement.querySelector(".book-id").id;
      let book = findBook(clicked);
      book.then(addUser)
    }
  }

  function removeLike(event){
    let unliked = event.target;
    if (unliked.className === "unlike-btn") {
      let clicked = event.target.parentElement.parentElement.querySelector(".book-id").id;
      let book = findBook(clicked);
      book.then(removeLastLike)
    }
  }

  function addUser(book) {
    const newUser = {"id":1, "username":"pouros"}
    book.users.push(newUser)
    updateDB(book.id, book.users);
    insertHTML(book)
  }

  function removeLastLike(book){
    console.log(book.users)
    if (book.users.slice(-1)[0].username === "pouros") {
      book.users = book.users.slice(0, -1)
      updateDB(book.id, book.users);
      insertHTML(book)
    }
  }

  function updateDB(id, users){
    const options = {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        users: users
      })
    }
    return fetch(`http://localhost:3000/books/${id}`, options)
      .then(response => response.json())
  }

  getBooks()
});
