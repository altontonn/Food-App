import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}
/**
 //pasta with tomato and spinach
 acc:0 / acc + curr.length = 5 / newTitle = ['pasta];
 acc:5 / acc + curr.length = 9 / newTitle = ['pasta', 'with']
 acc:9 / acc + curr.length = 15 / newTitle = ['pasta', 'with', 'tomato']
 acc:15 / acc + curr.length = 18 / newTitle = ['pasta', 'with', 'tomato']
 acc:18 / acc + curr.length = 24 / newTitle = ['pasta', 'with', 'tomato']
 */

const limitRecipeTitle = (name, limit = 17) => {
    const newTitle = [];
    if(name.length > limit){
        name.split(' ').reduce((acc, curr) => {
            if(acc + curr.length <= limit){
                newTitle.push(curr);
            }
            return acc + curr.length
        }, 1)
        return `${newTitle.join(' ')}...`
    }
    return name;
}

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })

    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.id}">
                <figure class="results__fig">
                    <img src="${recipe.thumbnail_url}" alt="${recipe.name}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.name)}</h4>
                    <p class="results__author">${recipe.draft_status}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

const createButton = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
                <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>
            ` 

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if(page === 1 && pages > 1){
        //Only display next button
        button = createButton(page, 'next');
    }else if(page < pages){
        //Display both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `
    }else if(page === pages && pages > 1){
        //Only button to go to prev Button
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results for current page;
    const start = (page -1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination button
    renderButtons(page, recipes.length, resPerPage);

}
