import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard({ onLogout }) {
  const [menu, setMenu] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      const menuRes = await axios.get('http://localhost:5000/api/menu');
      const resRes = await axios.get('http://localhost:5000/api/reservations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMenu(menuRes.data);
      setReservations(resRes.data);
    };
    fetchData();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.description) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/menu', newItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMenu([...menu, res.data]);
      setNewItem({ name: '', price: '', description: '' });
    } catch (error) {
      alert('Failed to add item');
    }
  };

  const removeMenuItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMenu(menu.filter(item => item._id !== id));
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const handleReservationStatus = async (id, status) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/reservations/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setReservations(reservations.map(r => r._id === id ? res.data : r));
    } catch (error) {
      alert('Failed to update reservation');
    }
  };

  const markReservationCompleted = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/reservations/${id}`, 
        { status: 'completed' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setReservations(reservations.map(r => r._id === id ? res.data : r));
    } catch (error) {
      alert('Failed to mark as completed');
    }
  };

  const removeReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReservations(reservations.filter(r => r._id !== id));
    } catch (error) {
      alert('Failed to remove reservation');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Manage Menu</h2>
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Add New Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="px-3 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="px-3 py-2 border rounded"
            />
          </div>
          <button
            onClick={handleAddItem}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Item
          </button>
        </div>
        <h3 className="text-lg font-bold mb-2">Current Menu</h3>
        {menu.map(item => (
          <div key={item._id} className="flex justify-between items-center border p-4 mb-2 rounded">
            <div>
              <p><strong>{item.name}</strong> - ₹{item.price.toFixed(2)}</p>
              <p>{item.description}</p>
            </div>
            <button
              onClick={() => removeMenuItem(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Manage Reservations</h2>
        {reservations.length === 0 ? (
          <p>No reservations found</p>
        ) : (
          reservations.map(reservation => (
            <div key={reservation._id} className="border p-4 mb-4 rounded">
              <p><strong>ID:</strong> {reservation._id}</p>
              <p><strong>Date:</strong> {reservation.date}</p>
              <p><strong>Time:</strong> {reservation.time}</p>
              <p><strong>Seats:</strong> {reservation.seats}</p>
              <p><strong>Status:</strong> {reservation.status}</p>
              <p><strong>Payment Status:</strong> {reservation.paymentStatus}</p>
              <div>
                <p><strong>Order:</strong></p>
                {reservation.cart.map(item => (
                  <p key={item.itemId}>
                    {item.name} x {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                ))}
              </div>
              {reservation.status === 'pending' && (
                <div className="mt-2">
                  <button
                    onClick={() => handleReservationStatus(reservation._id, 'approved')}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReservationStatus(reservation._id, 'rejected')}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
              {reservation.status === 'approved' && (
                <button
                  onClick={() => markReservationCompleted(reservation._id)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Mark as Completed
                </button>
              )}
              <button
                onClick={() => removeReservation(reservation._id)}
                className="mt-2 bg-gray-500 text-white px-4 py-2 rounded ml-2"
              >
                Remove Reservation
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;