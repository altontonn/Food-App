import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/**Global state of the app
 *  - Search Object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () =>{
  //1) get query from view
  const query = searchView.getInput();

  if(query){
    //2) new search object and add to state
    state.search = new Search(query);

    //3). prepare UI for the results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes)
    //4). Search for the recipes
    try {
      
      await state.search.getResults();
  
      //5.Render results on the UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch(err){
      alert('Something went wrong with the search...')
    }
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
})

elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline')
  if(btn){
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  } 
})


/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  //Get ID from the url
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if(id){
    //prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe)

    //Highlight selected search item
    if(state.search)searchView.highlightSelected(id)
    //Create new Recipe object
    state.recipe = new Recipe(id);

    //TESTING
    //window.r = state.recipe;
    
    try {
      //Get recipe data and parseIngredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //Calculate servings and time
      state.recipe.calcTime();
      // state.recipe.calcServings();
      //Render recipe
      //console.log(state.recipe)
      clearLoader();
      recipeView.renderRecipe(state.recipe)
    } catch(error){
        alert('Error processing the recipe!');
    }
  }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if(e.target.matches('.btn-decrease, .btn-decrease *')){
    //decrease button is clicked
    if(state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  }else if(e.target.matches('.btn-increase, .btn-increase *')){
    //increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }
  console.log(state.recipe)
})