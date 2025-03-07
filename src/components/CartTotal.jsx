import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = ({ items }) => {

    const { currency, delivery_fee } = useContext(ShopContext)
     
    const calculateTotal = () => {
        return items.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    };

    const cartAmount = calculateTotal();

  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1 = {'CART'} text2= {'TOTALS'} />

        </div>
        <div className='flex flex-col gap-2 mt-2 text-sm'>

            <div className='flex justify-between'>
                 
             <p>Subtotal</p>
             <p>{currency} {cartAmount}.00 </p>
             
            </div>
            <hr />
            <div className='flex justify-between' >
                <p>Shipping Fee</p>
                <p> {currency} {delivery_fee}.00</p>

            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Total</b>
                <b> {currency} {cartAmount === 0 ? 0 : cartAmount + delivery_fee } </b>

            </div>
        </div>

    </div>
  )
}

export default CartTotal