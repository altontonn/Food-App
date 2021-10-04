import axios from 'axios';
import numericQuantity from 'numeric-quantity';

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        var options = {
            method: 'GET',
            url: 'https://tasty.p.rapidapi.com/recipes/detail',
            params: {id: `${this.id}`},
            headers: {
                'x-rapidapi-host': 'tasty.p.rapidapi.com',
                'x-rapidapi-key': '3b65bc8f38msh689ec50b3485627p1e0461jsn68711c03a89a'
            }
          };
        try {
            const res = await axios.request(options).then(function(response){
                return response.data
            });
            //this.data = res;
            this.title = res.name;
            this.status = res.draft_status;
            this.img = res.thumbnail_url;
            this.ingredients = res.sections[0].components.map(el => {
                return el.raw_text;
            })
            this.cookTime = res.cook_time_minutes;
            this.servings = res.num_servings;
        } catch(error){
            console.log(error);
            alert('Something went wrong :(')
        }
    }

    calcTime(){
        //Assuming that we need 15min for each nutrition
        const numImg = this.cookTime;
        const periods = Math.ceil(numImg / 3);
        this.time = periods * 15;
    }

    // calcServings(){
    //     const serve = this.servings;
    //     this.serving = serve;
    // }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'grams', 'gram'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'gm', 'gm'];
        const units = [...unitsShort, 'kg']

        const newIngredients = this.ingredients.map(el => {
            //1. Uniform Units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })

            //2. Remove Paranthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); 

            //3. Parse Ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if(unitIndex > -1){
                //there is a unit;
                //Ex. 4 1/2 cups, arrCount is [4, 1/2] ---> eval("4+1/2") = 4.5
                //Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                
                if(arrCount.length === 1){
                    count = numericQuantity(arrIng[0].replace('-', '+'));
                }else{
                    count = numericQuantity(arrIng.slice(0, unitIndex).join('+'))
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            }else if(numericQuantity(arrIng[0], 10)){
                //there is NO unit, but the 1st element is a NUMBER
                objIng = {
                    count: numericQuantity(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }else if(unitIndex === -1){
                //there is NO unit and a NUMBER in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;

        });
        this.ingredients = newIngredients;
    }

    updateServings (type){
        //servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        //ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}
