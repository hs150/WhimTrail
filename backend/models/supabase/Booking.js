const supabase = require('./index');

// Create a booking
async function createBooking(bookingData) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select();

  if (error) throw error;
  return data[0];
}

// Get bookings by user
async function getBookingsByUser(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// Get booking by ID
async function getBookingById(id) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Update booking
async function updateBooking(id, updates) {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

// Delete booking
async function deleteBooking(id) {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  createBooking,
  getBookingsByUser,
  getBookingById,
  updateBooking,
  deleteBooking,
};
