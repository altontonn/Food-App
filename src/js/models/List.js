import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.items = [];
    }
    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count, 
            unit,
            ingredient
        }
    }
    deleteItem(id){
        const index = this.items.findIndex(el => el.id ===id)
        //[2,4,8] splice(1, 1) ->returns 4, original array[2,8]
        //[2,4,8] slice(1, 1) ->returns 4, original array[2,4,8]
        this.items.splice(index, 1);
    }

    updateCount(id, count){
        
    }
}
