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
        ingredients : {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 8,
        purchaseable: false,
        purchasing: false,
        loading: false
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
        //alert('Continuing...');
        this.setState({
            loading: true
        });
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'PRD',
                address: {
                    street: 'Some test street address',
                    zipCode: '34564',
                    country: 'Wonder Land'
                },
                email: 'lala@wonder.com'

            }
        }
        axios.post('/orders.json', order)
             .then(response => {
                 console.log(response)
                 this.setState({
                    loading: false,
                    purchasing: false
                })
             })
             .catch(err => {
                 console.log(err);
                 this.setState({
                    loading: false,
                    purchasing: false
                })
             })
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
        let orderSummary = <OrderSummary 
                            purchaseCancelled={this.purchaseCancelHandeler}
                            purchaseContinued={this.purchaseContinueHandeler}
                            price={this.state.totalPrice}
                            ingredients={this.state.ingredients}>
                        </OrderSummary>;
        if(this.state.loading) {
            orderSummary = <Spinner />
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandeler}> 
                    {orderSummary}
                </Modal>

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
}
export default withErrorHandler(BurgerBuilder, axios);