
import { openModal } from './assets/javascripts/modal';
import './assets/styles/styles.scss';
import './index.scss';

const url = 'http://localhost:3000/posts';

const articleContainerElement = document.querySelector('.articles-container');
const categoriesContainerElement = document.querySelector('.categories');

let articles;
let filter;


const formatDate = date => {
	return new Date(date).toLocaleDateString('fr-FR', {
		weekday: 'long',
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});
};

const createArticles = () => {
	const articlesDom = articles.filter(article => {
		if (filter){
			return article.category ===filter;
		} else{
			return true;
		}
	}).map(article => {
		// console.log(article);
		const articleDom = document.createElement('div');
		articleDom.classList.add('article');
		articleDom.innerHTML = `
      <img src="${article.img}" alt="profile" />
      <h2>${article.title}</h2>
      <p class="article-author">${article.author} - ${formatDate(
			article.createdAt
		)}</p>
      <p class="article-content">${article.content}</p>
      <div class="article-actions">
        <button class="btn btn-danger" data-id=${article.id} >Supprimer</button>
        <button class="btn btn-primary" data-id=${article.id} >Modifier</button>
      </div>
    `;
		return articleDom;
	});
	articleContainerElement.innerHTML = '';
	articleContainerElement.append(...articlesDom);

	const deleteButtons = articleContainerElement.querySelectorAll('.btn-danger');
	const editButtons = articleContainerElement.querySelectorAll('.btn-primary');

	editButtons.forEach(button => {
		button.addEventListener('click', event => {
			const articleId = event.target.dataset.id;
			window.location.assign(`/form.html?id=${articleId}`);
		});
	});

	deleteButtons.forEach(button => {
		button.addEventListener('click', async event => {
			const result = await openModal("Etes vous sur de vouloir supprimer votre article?");
			if (result === true) {

					try {
						const articleId = event.target.dataset.id;
						const response = await fetch(`${url}/${articleId}`, {
							method: 'DELETE',
						});
						await response.json();
						fetchArticle();
					} catch (e) {
						console.log('e : ', e);
					}
			}
		});
	});
};
const displayMenuCategories = (categoriesArr)=>{
	const liElements = categoriesArr.map(categoryElem =>{
		const li = document.createElement('li');
		li.innerHTML = `${categoryElem[0]} ( <strong>${categoryElem[1]}</strong> )	`;
		li.addEventListener('click', ()=> {
			if (filter === categoryElem[0] ) {
				filter = null;
				li.classList.remove('active');
			} else{
				filter =categoryElem[0];
				liElements.forEach(li => {
					li.classList.remove('active');
					})
					li.classList.add('active')
			}
			createArticles();
		})
		return li;
	})

	categoriesContainerElement.innerHTML="";
	categoriesContainerElement.append(...liElements);
}

const createMenuCategories = () =>{
	const categories = articles.reduce((acc, article) =>{
		if (acc[article.category]) {
			acc[article.category]++;
			
		} else{
			acc[article.category] = 1
		}
		return acc;
		}, {}	) 
		const categoriesArr = Object.keys(categories).map(category => {
			return [category, categories[category]];
		}).sort((c1, c2) => c1[0].localeCompare(c2[0]));

		displayMenuCategories(categoriesArr);

}


const fetchArticle = async () => {
	try {
		const response = await fetch(url);
		articles = await response.json();
		createArticles();
		createMenuCategories();
	} catch (e) {
		console.log('e : ', e);
	}
};

fetchArticle();
