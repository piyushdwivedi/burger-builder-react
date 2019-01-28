import * as actionTypes from './actions';

const initialState = {
    ingredients : {
        salad: 0,
        bacon: 0,
        meat: 0,
        cheese: 0
    },
    totalPrice: 8,
    purchasable: false
}
const INGREDIENT_PRICES = {
    salad: 1,
    cheese: 1,
    meat: 3,
    bacon: 2
};
const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.ADD_INGREDIENT: 
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
                },
                totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
                purchasable: true
            };
        case actionTypes.REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] - 1
                },
                totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
                purchasable: true
            };
        default:
            return state;
    }
}
export default reducer;