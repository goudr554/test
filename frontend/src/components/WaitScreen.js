import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function WaitScreen({ user, onLogout }) {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      const res = await axios.get(`http://localhost:5000/api/reservations/user/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReservations(res.data);
    };
    fetchReservations();
  }, [user.id]);

  const processPayment = async (reservationId) => {
    try {
      await axios.put(`http://localhost:5000/api/reservations/${reservationId}`, 
        { paymentStatus: 'completed' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Payment processed successfully!');
      setReservations(reservations.map(r => 
        r._id === reservationId ? { ...r, paymentStatus: 'completed' } : r
      ));
    } catch (error) {
      alert('Payment failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Reservations</h1>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Waiting for Approval</h2>
        {reservations.length === 0 ? (
          <p>No reservations found</p>
        ) : (
          reservations.map(reservation => (
            <div key={reservation._id} className="border p-4 mb-4 rounded">
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
              {reservation.status === 'approved' && reservation.paymentStatus === 'pending' && (
                <button
                  onClick={() => processPayment(reservation._id)}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Proceed to Payment
                </button>
              )}
            </div>
          ))
        )}
        <button
          onClick={() => navigate('/home')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default WaitScreen;