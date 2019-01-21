import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    state = {
        ingredients: null,
        totalPrice: 0
    }
    componentWillMount() {
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        let totalPrice = 0;
        for (let param of query.entries()) {
            if(param[0] === 'price') {
                totalPrice = param[1];
            } else {
                ingredients[param[0]]  = +param[1]
            }
            
        }
        console.log('Total price set:' + totalPrice);
        this.setState({
            ingredients: ingredients,
            totalPrice: +totalPrice
        })
    }

    checkoutCanceled = () => {
        this.props.history.goBack();
    }
    checkoutContinued = () => {
        this.props.history.replace('/checkout/contact-data');
    }
    render() {
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients} 
                    checkoutCanceled={this.checkoutCanceled}
                    checkoutContinued={this.checkoutContinued}
                    price={this.state.totalPrice}
                />
                <Route path={this.props.match.path + '/contact-data'} 
                       render={(props) => (<ContactData {...props} ingredients={this.state.ingredients} price={this.state.totalPrice}/>)}
                />
            </div>
        );
    }
}
export default Checkout;