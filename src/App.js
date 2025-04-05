import React, {useState, useEffect} from 'react'
import './App.css'

const PRODUCTS = [
    { id: 1, name: "Laptop", price: 500 },
    { id: 2, name: "Smartphone", price: 300 },
    { id: 3, name: "Headphones", price: 100 },
    { id: 4, name: "Smartwatch", price: 150 },
];
  
const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

const App = () => {
    const [quantities, setQuantities] = useState({})
    const [cart, setCart] = useState([])
    const [showGiftMessage, setShowGiftMessage] = useState(false)

    const cartSubtotal = cart.filter((item) => item.id !== FREE_GIFT.id).reduce((acc, item) =>
        acc + item.price * item.quantity, 0)

    useEffect(() => {
        const hasGift = cart.find((item) => item.id === FREE_GIFT.id)
        if (cartSubtotal >= THRESHOLD && !hasGift) {
            setCart([...cart, {...FREE_GIFT, quantity: 1}])
            setShowGiftMessage(true)
            setTimeout(() => {
                setShowGiftMessage(false)
            }, 3000);
        }else if (cartSubtotal < THRESHOLD && hasGift) {
            setCart(cart.filter((item) => item.id !== FREE_GIFT.id))
        }
    }, [cart, cartSubtotal])

    const addToCart = (product) => {
        const existing = cart.find((item) => item.id === product.id)
        const qty = quantities[product.id] || 1
        if (existing) {
            setCart(cart.map((item) =>
            item.id === product.id ? {...item, quantity: item.quantity + qty} : item))
        }else {
            setCart([...cart, {...product, quantity: qty}])
        }
        setQuantities({...quantities, [product.id]: 1})
    }

    const updateCartQty = (id, delta) => {
        const updated = cart.map((item) => item.id === id ? {...item, quantity: item.quantity + delta} : item).filter((item) => item.quantity > 0)
        setCart(updated)
    }

    const removeFromCart = (id) => {
        if (id === FREE_GIFT.id) return
        setCart(cart.filter((item) => item.id !== id))
    }

    return (
        <div className='app'>
            <h1 className='title'>Shopping Cart</h1>

            <h2>Products</h2>
            <div className='products'>
                {PRODUCTS.map((product) => (
                    <div className='product-card' key={product.id}>
                        <h3>{product.name}</h3>
                        <p>${product.price}</p>
                        <div className='qty-controls'>
                            <button onClick={() => setQuantities((prev) => ({
                                ...prev, [product.id] : Math.max((prev[product.id] || 1) - 1, 1),
                            }))}>-</button>
                            <span>{quantities[product.id] || 1}</span>
                            <button onClick={() => setQuantities((prev) => ({
                                ...prev, [product.id] : (prev[product.id] || 1) + 1,
                            }))}>+</button>
                        </div>
                        <button className='add-btn' onClick={() => addToCart(product)}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            <h2>Cart Summary</h2>
            <div className='progress-container'>
                <div className='progress-head'><h3>Subtotal:</h3>
                <h3>${cartSubtotal}</h3></div>
                <hr/>
                <p>{cartSubtotal < THRESHOLD ? `Add $${THRESHOLD - cartSubtotal} more to get a FREE Wireless Mouse!` : 'You got a free Wireless Mouse!'}</p>
                <div className='progress-bar'>
                    <div className='progress'
                    style={{ width: `${Math.min((cartSubtotal / THRESHOLD) * 100, 100)}%`,}}></div>
                </div>
            </div>

            {showGiftMessage && <div className='gift-msg'>Free Gift Added!</div>}

            <h2>Cart Items</h2>
            <div className='cart'>
                {cart.length === 0 ? (
                    <>
                    <h4>Your cart is empty</h4>
                    <p>Add some products to see them here!</p>
                    </>
                ) : (
                    <ul>
                        {cart.map((item) => (
                            <li key={item.id}>
                                <span>
                                    {item.name} - ${item.price} x {item.quantity}=${item.price*item.quantity}
                                </span>
                                {item.id !== FREE_GIFT.id && (
                                    <span className='cart-btns'>
                                        <button className='btn2' onClick={() =>updateCartQty(item.id, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button className='btn1' onClick={() => updateCartQty(item.id, 1)}>+</button>
                                        <button onClick={() => removeFromCart(item.id)}>Remove</button>
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    )
}

export default App
