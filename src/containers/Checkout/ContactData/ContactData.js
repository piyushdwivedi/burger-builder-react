import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    getConfigObject = (elementType, type, placeholder) => {
        return {
            elementType,
            config: {
                type,
                placeholder
            },
            value: ''
        }
    }
    state = {
        oderForm: {
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
                value: ''
            }
        },
        loading: false
    }
    
    orderSubmitted = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price
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
    inputChanged = (event, input) => {
        let updatedForm = {...this.state.orderForm};
        let formEle = {...updatedForm[input]};
        formEle.value = event.target.value; 
        updatedForm[input] = formEle;
        this.setState({
            orderForm: updatedForm
        })
    }
    render() {
        let formElementsList = [];
        for(let key in this.state.oderForm) {
            formElementsList.push({
                id: key,
                config: this.state.oderForm[key]
            })
        }
        let form = ( 
        <form>
            {formElementsList.map(ele => (
                <Input 
                    key={ele.id}
                    type={ele.config.elementType}
                    config={ele.config.config}
                    value={ele.value}
                    changed={(event) => this.inputChanged(event, ele.id)}
                />
            ))}
            <Button btnType="Success" clicked={this.orderSubmitted}>ORDER</Button>
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
export default ContactData;