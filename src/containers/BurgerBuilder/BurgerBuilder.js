import React, {Component} from 'react';
import {connect} from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
    state = {
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
    
    purchaseHandle = () => {
        this.setState({
            purchasing: true
        })
    }
    purchaseContinueHandeler = () => {
        this.props.history.push('/checkout');
    }
    purchaseCancelHandeler = () => {
        this.setState({
            purchasing: false
        })
    }
    render() {
        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients cant be loaded</p> : <Spinner />
        if(this.props.ings) {
            orderSummary = <OrderSummary 
                            purchaseCancelled={this.purchaseCancelHandeler}
                            purchaseContinued={this.purchaseContinueHandeler}
                            price={this.props.tPrice}
                            ingredients={this.props.ings}>
                        </OrderSummary>;

            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                        disabled={disabledInfo}
                        price={this.props.tPrice}
                        purchaseable={this.props.purchasable}
                        ingredientsAdded={this.props.onIngredientAdded}
                        ingredientsRemoved={this.props.onIngredientRemoved}
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

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        tPrice: state.totalPrice,
        purchasable: state.purchasable
    };
    
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({
            type: actionTypes.ADD_INGREDIENT,
            ingredientName: ingName
        }),
        onIngredientRemoved: (ingName) => dispatch({
            type: actionTypes.REMOVE_INGREDIENT,
            ingredientName: ingName
        })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));