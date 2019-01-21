import React from 'react';
import classes from './Order.css';

const Order = (props) => {
    let ingredients = [];
    for(let ingredientName in props.ingredients) {
        ingredients.push({
            name: ingredientName,
            amount: props.ingredients[ingredientName],

        })
    }
    let ingredientList = ingredients.map(item => {
        return <span style={
            {
                textTransform: 'capitalize', 
                display: 'inline-block',
                margin: '0 8px',
                border: '1px solid #ccc',
                padding: '5px'
            }}
                key={item.name}>{item.name} ({item.amount})</span>;
    })
    return(
        <div className={classes.Order}>
            <p>Ingredients: {ingredientList}</p>
            <p>Price: <strong>${props.price}</strong></p>
        </div>
    )
}
export default Order;