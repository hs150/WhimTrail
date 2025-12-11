const supabase = require('./index');

// Create a payment
async function createPayment(paymentData) {
  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select();

  if (error) throw error;
  return data[0];
}

// Get payments by user
async function getPaymentsByUser(userId) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// Get payment by transaction ID
async function getPaymentByTransaction(transactionId) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('transaction_id', transactionId)
    .single();

  if (error) throw error;
  return data;
}

// Update payment status
async function updatePaymentStatus(id, status) {
  const { data, error } = await supabase
    .from('payments')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

// Delete payment
async function deletePayment(id) {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  createPayment,
  getPaymentsByUser,
  getPaymentByTransaction,
  updatePaymentStatus,
  deletePayment,
};
