import axios from 'axios';

export default class Search {
    constructor(query){
        this.query = query;
    }

    async getResults(){
        //const proxy = 'https://crossorigin.me/';
        // const key = '225fdca02emshf8a8a239adfc1f5p14d317jsna0ed22776ec3';
        var options = {
            method: 'GET',
            url: 'https://tasty.p.rapidapi.com/recipes/list',
            params: {from: '0', size: '30', q: `${this.query}`},
            headers: {
                'x-rapidapi-host': 'tasty.p.rapidapi.com',
                'x-rapidapi-key': '3b65bc8f38msh689ec50b3485627p1e0461jsn68711c03a89a'
            }
          };
        try {
            const res = await axios.request(options).then(function(response){
                return response.data.results
            });
            this.result = res;
        } catch (error){
            alert(error);
        }
    }
}
