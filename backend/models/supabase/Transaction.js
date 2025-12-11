const supabase = require('./index'); // your Supabase client

// Create a new transaction
async function createTransaction(data) {
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return transaction;
}

// Get transaction by ID
async function getTransactionById(id) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Get transactions by user
async function getTransactionsByUser(userId) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Update transaction
async function updateTransaction(id, updates) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete transaction
async function deleteTransaction(id) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  createTransaction,
  getTransactionById,
  getTransactionsByUser,
  updateTransaction,
  deleteTransaction
};