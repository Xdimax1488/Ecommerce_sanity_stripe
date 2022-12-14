import Link from 'next/link';
import { useRef } from 'react';
import { AiOutlineLeft, AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
import {TiDeleteOutline } from 'react-icons/ti'
import toast from 'react-hot-toast'

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe'

function Cart() {
  const cartRef = useRef();
  const { totalPrice, totalQuantities, setShowCart, cartItems,toggleCartItemQuanitity,onRemove } = useStateContext();
  const handleCheckout=async() => {
    const stripe = await getStripe();

    const response = await fetch('/api/stripe',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',},
        body:JSON.stringify(cartItems),
    });
    if(response.statusCode === 500) return;

    const data = await response.json();
    toast.loading('Redirecting...');

    stripe.redirectToCheckout({sessionId:data.id});


  }
  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button className="cart-heading" type="button" onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
          <span className="heading">You cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>You shopping bag is empty</h3>
            <Link href="/">
              <button className="btn" type="buton" onClick={() => setShowCart(false)}>
                {' '}
                Continue shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className="product" key={item._id}>
                <img src={urlFor(item?.image[0])} alt="" className="cart-product-image" />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>${item.price}</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span className="minus" onClick={()=>toggleCartItemQuanitity(item._id,'dec')}>
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span className="plus" onClick={()=>toggleCartItemQuanitity(item._id,'inc')}>
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button 
                    type='button'
                    className="remove-item"
                    onClick={()=>onRemove(item)}>
                      <TiDeleteOutline/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItems.length >= 1 &&(
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button
              type='button'
               className="btn"
               onClick={handleCheckout}>
                Pay with stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
