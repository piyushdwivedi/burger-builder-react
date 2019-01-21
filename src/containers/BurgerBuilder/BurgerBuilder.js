import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
    salad: 1,
    cheese: 1,
    meat: 3,
    bacon: 2
};

class BurgerBuilder extends Component {
    state = {
        ingredients : null,
        totalPrice: 8,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: null
    }

    componentDidMount = () => {
        axios.get('https://react-burger-builder-36555.firebaseio.com/ingredients.json')
             .then(resp => {
                this.setState({
                    ingredients: resp.data
                })
             })
             .catch(err => {
                 this.setState({
                     error: true
                 })
             })
    }
    updatePurchaseState = (ingredients) => {
        // const ingredients = {
        //     ...this.state.ingredients
        // }
        const sum = Object.keys(ingredients)
                .map(igKey => {
                    return ingredients[igKey];
                })
                .reduce((sum, el) => {
                    return sum + el
                }, 0);
        this.setState({
            purchaseable: sum > 0 ? true : false
        })

    }
    addIngredientHandle = (type) => {
        const updatedCount = this.state.ingredients[type] + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const addedPrice = INGREDIENT_PRICES[type];
        const newPrice = this.state.totalPrice + addedPrice;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients);
    }
    removeIngredientHandle = (type) => {
        if(this.state.ingredients[type]  === 0) {
            return;
        }
        const updatedCount = this.state.ingredients[type] - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const addedPrice = INGREDIENT_PRICES[type];
        const newPrice = this.state.totalPrice - addedPrice;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients);
    }
    purchaseHandle = () => {
        this.setState({
            purchasing: true
        })
    }
    purchaseContinueHandeler = () => {
        const queryParams = [];
        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        }
        queryParams.push('price=' + this.state.totalPrice);
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryParams.join('&')
        });
    }
    purchaseCancelHandeler = () => {
        this.setState({
            purchasing: false
        })
    }
    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients cant be loaded</p> : <Spinner />
        if(this.state.ingredients) {
            orderSummary = <OrderSummary 
                            purchaseCancelled={this.purchaseCancelHandeler}
                            purchaseContinued={this.purchaseContinueHandeler}
                            price={this.state.totalPrice}
                            ingredients={this.state.ingredients}>
                        </OrderSummary>;

            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchaseable={this.state.purchaseable}
                        ingredientsAdded={this.addIngredientHandle}
                        ingredientsRemoved={this.removeIngredientHandle}
                        ordered={this.purchaseHandle}
                    />
                </Aux>    
                );
        }
        
        if(this.state.loading) {
            orderSummary = <Spinner />
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandeler}> 
                    {orderSummary}
                </Modal>
                {burger}    
            </Aux>
        );
    }
}
export default withErrorHandler(BurgerBuilder, axios);