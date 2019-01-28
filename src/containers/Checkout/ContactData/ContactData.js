import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import {connect} from 'react-redux';

class ContactData extends Component {
    getConfigObject = (elementType, type, placeholder) => {
        return {
            elementType,
            config: {
                type,
                placeholder
            },
            value: '',
            validation: {
                required: true,
                valid: false
            },
            touched: false
        }
    }
    state = {
        orderForm: {
            name: this.getConfigObject('input', 'text', 'Your Name'),
            street: this.getConfigObject('input', 'text', 'Your Address'),
            zipCode: this.getConfigObject('input', 'text', 'Your Zipcode'),
            country: this.getConfigObject('input', 'text', 'Your Country'),
            email: this.getConfigObject('input', 'email', 'Your Email'),
            delivery: {
                elementType : 'select',
                config: {
                    options: [
                        {
                            value: 'fastest',
                            displayVal: 'Fastest'
                        },
                        {
                            value: 'cheapest',
                            displayVal: 'Cheapest'
                        }
                    ]
                },
                value: '',
                validation: {
                    valid: true
                }
            }
        },
        loading: false,
        formIsValid: false
    }
    
    orderSubmitted = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        let formData = {};
        for(let formEle in this.state.orderForm) {
            formData[formEle] = this.state.orderForm[formEle].value 
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData
        }
        axios.post('/orders.json', order)
             .then(response => {
                 console.log(response)
                 this.setState({
                    loading: false,
                    purchasing: false
                })
                this.props.history.push('/')
             })
             .catch(err => {
                 console.log(err);
                 this.setState({
                    loading: false,
                    purchasing: false
                })
        })
    }
    inputChanged = (event, inputIdentifier) => {
        let updatedForm = {
            ...this.state.orderForm
        };
        let formEle = {
            ...updatedForm[inputIdentifier]
        };
        formEle.value = event.target.value;
        formEle.touched = true;
        this.validateFields(formEle.value, formEle.validation); 
        updatedForm[inputIdentifier] = formEle;
        console.log(updatedForm);
        let formValid = true;
        for(let i in updatedForm) {
            formValid = updatedForm[i].validation.valid && formValid;
        }
        this.setState({
            orderForm: updatedForm,
            formIsValid: formValid
        })
    }

    validateFields = (val, rules) => {
        let isValidVal = false;
        if(rules.required) {
            isValidVal = val.trim() !== '';
        }
        rules.valid = isValidVal;
    }
    render() {
        let formElementsList = [];
        for(let key in this.state.orderForm) {
            formElementsList.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
    
        let form = ( 
        <form onSubmit={this.orderSubmitted}>
            {formElementsList.map(ele => ( 
                <Input 
                    key={ele.id}
                    type={ele.config.elementType}
                    config={ele.config.config}
                    value={ele.value}
                    changedVal={ele.config.touched}
                    shouldValidate={ele.config.validation}
                    invalid={ele.config.validation && !ele.config.validation.valid}
                    changed={(event) => this.inputChanged(event, ele.id)}
                />
            ))}
            <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
        </form>);
        if(this.state.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter contact data</h4>
                {form}
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        price: state.totalPrice
    }
}
export default connect(mapStateToProps)(ContactData);