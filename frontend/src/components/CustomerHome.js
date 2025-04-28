import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CustomerHome({ user, onLogout }) {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await axios.get('http://localhost:5000/api/menu');
      setMenu(res.data);
    };
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    setCart([...cart, { ...item, quantity: 1 }]);
  };

  const updateCartQuantity = (itemId, quantity) => {
    setCart(cart.map(item => 
      item._id === itemId ? { ...item, quantity: parseInt(quantity) } : item
    ).filter(item => item.quantity > 0));
  };

  const submitReservation = async () => {
    if (!date || !time || seats < 1) {
      alert('Please fill in all reservation details');
      return;
    }
    if (cart.length === 0) {
      alert('Please add items to your cart');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/reservations', {
        userId: user.id,
        date,
        time,
        seats,
        cart: cart.map(item => ({ itemId: item._id, name: item.name, price: item.price, quantity: item.quantity })),
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCart([]);
      navigate('/wait');
    } catch (error) {
      alert('Failed to submit reservation');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Restaurant Reservation</h1>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Make a Reservation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Seats</label>
            <input
              type="number"
              min="1"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menu.map(item => (
            <div key={item._id} className="border p-4 rounded">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-gray-800 font-bold">₹{item.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(item)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div>
            {cart.map(item => (
              <div key={item._id} className="flex justify-between items-center mb-2">
                <div>
                  <p>{item.name} - ₹{item.price.toFixed(2)}</p>
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => updateCartQuantity(item._id, e.target.value)}
                    className="w-16 px-2 py-1 border rounded"
                  />
                </div>
                <p>₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <p className="font-bold mt-4">
              Total: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </p>
            <button
              onClick={submitReservation}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit Reservation & Order
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/wait')}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        View Reservations
      </button>
    </div>
  );
}

export default CustomerHome;