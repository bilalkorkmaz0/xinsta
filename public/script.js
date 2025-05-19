let users = [];
let posts = [];
let currentUser = null;
let targetUser = null;

function save() {
  fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users, posts })
  });
}

function handleLogin() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: u, password: p }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.redirect) {
        window.location.href = data.redirect;
      } else if (data.error) {
        alert(data.error);
      }
    })
    .catch((err) => {
      console.error("Giriş hatası:", err);
    });
}



function logout() {
  localStorage.removeItem("sessionUser");
  window.location.href = "index.html";
}

function createUser() {
  const u = document.getElementById("newUsername").value.trim();
  const p = document.getElementById("newPassword").value.trim();
  const b = document.getElementById("newBio").value.trim();
  if (!u || !p) return alert("Boş bırakmayın");

  users.push({ username: u, password: p, bio: b });
  save();
  renderUsers();
}

function renderUsers() {
  const ul = document.getElementById("userList");
  ul.innerHTML = "";
  users.forEach(u => {
    const li = document.createElement("li");
    li.innerHTML = \`
      <b>\${u.username}</b> (\${u.bio})
      <button onclick="setTarget('\${u.username}')">Gönderileri Gör</button>
    \`;
    ul.appendChild(li);
  });
}

function setTarget(username) {
  targetUser = username;
  renderUserPosts(username);
}

function renderUserPosts(username) {
  const grid = document.getElementById("userGrid");
  if (!grid) return;
  grid.innerHTML = "";
  posts.filter(p => p.owner === username).forEach(p => {
    const img = document.createElement("img");
    img.src = p.src;
    grid.appendChild(img);
  });
}

function submitPost() {
  const input = document.getElementById("uploadInput");
  const file = input.files[0];
  if (!file || !targetUser) return alert("Dosya veya kullanıcı yok");

  const reader = new FileReader();
  const caption = prompt("Açıklama");

  reader.onload = function(e) {
    posts.push({ owner: targetUser, src: e.target.result, caption });
    save();
    renderUserPosts(targetUser);
  };
  reader.readAsDataURL(file);
}

function load() {
  fetch("/data.json")
    .then(res => res.json())
    .then(data => {
      users = data.users || [];
      posts = data.posts || [];
      renderUsers();
    });

  if (window.location.pathname.includes("user.html")) {
    const sessionUser = localStorage.getItem("sessionUser");
    if (!sessionUser) {
      window.location.href = "index.html";
    } else {
      fetch("/data.json")
        .then(res => res.json())
        .then(data => {
          const userPosts = data.posts.filter(p => p.owner === sessionUser);
          const grid = document.getElementById("userGrid");
          const title = document.getElementById("userTitle");
          if (title) title.textContent = sessionUser + " Paneli";
          grid.innerHTML = "";
          userPosts.forEach(p => {
            const img = document.createElement("img");
            img.src = p.src;
            grid.appendChild(img);
          });
        });
    }
  }
}

window.onload = load;
