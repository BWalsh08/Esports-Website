function addPost() {
    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;

    if (username && message) {
        const postList = document.getElementById('postList');

        const post = document.createElement('li');
        post.className = 'post';

        const postContent = `
            <h3>${username}</h3>
            <p>${message}</p>
        `;

        post.innerHTML = postContent;
        postList.appendChild(post);

        // Clear input fields
        document.getElementById('username').value = '';
        document.getElementById('message').value = '';
    } else {
        alert('Please enter both a name and a message.');
    }
}