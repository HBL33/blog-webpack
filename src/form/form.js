import "../assets/styles/styles.scss";
import "./form.scss";

const form = document.querySelector("form");
const errorElement = document.getElementById("errors");
const btnCancel = document.querySelector(".btn-secondary");
let errors = [];
let articleId;

const fillForm = (article) => {
  const author = document.querySelector('input[name="author"]');
  const img = document.querySelector('input[name="img"]');
  const category = document.querySelector('input[name="category"]');
  const title = document.querySelector('input[name="title"]');
  const content = document.querySelector("textarea");
  author.value = article.author || "";
  img.value = article.img || "";
  category.value = article.category || "";
  title.value = article.title || "";
  content.value = article.content || "";
};

const initForm = async () => {
  const params = new URL(window.location.href);
  articleId = params.searchParams.get("id");
  if (articleId) {
    const response = await fetch(`http://localhost:3000/posts/${articleId}`);
    if (response.status < 300) {
      const article = await response.json();
      fillForm(article);
    }
  }
};

initForm();

btnCancel.addEventListener("click", () => {
  window.location.assign("/index.html");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const date = new Date();
  formData.append("createdAt", date);
  const article = Object.fromEntries(formData.entries());

  if (formIsValid(article)) {
    try {
      let response;
      const articleJson = JSON.stringify(article);

      if (articleId) {
        response = await fetch(`http://localhost:3000/posts/${articleId}`, {
          method: "PATCH",
          body: articleJson,
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        response = await fetch("http://localhost:3000/posts", {
          method: "POST",
          body: articleJson,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      if (response.status < 299) {
        window.location.assign("/index.html");
      }
    } catch (e) {
      console.log("e : ", e);
    }
  }
});

const formIsValid = (article) => {
  if (
    !article.author ||
    !article.img ||
    !article.category ||
    !article.content ||
    !article.title
  ) {
    errors.push("Vous devez renseigner tous les champs");
  } else if (article.content.length < 20) {
    errors = [];
    errors.push("Le contenu de votre article est trop court !");
  } else {
    errors = [];
  }

  if (errors.length) {
    let errorHTML = "";
    errors.forEach((e) => {
      errorHTML += `<li>${e}</li>`;
    });
    errorElement.innerHTML = errorHTML;
    return false;
  } else {
    errorElement.innerHTML = "";
    return true;
  }
};
