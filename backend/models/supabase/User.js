const supabase = require('./index');
const bcrypt = require('bcrypt');

// Create a user (with password hashing)
async function createUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password: hashedPassword
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
// Get user by email
async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle(); // safe: returns null if no match

  if (error) throw error;
  return data;
}

// Compare password
async function comparePassword(email, plainPassword) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const match = await bcrypt.compare(plainPassword, user.password);
  return match ? user : null;
}

// Update user
async function updateUser(id, updates) {
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single(); // update should affect one row

  if (error) throw error;
  return data;
}

// Delete user
async function deleteUser(id) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  createUser,
  getUserByEmail,
  comparePassword,
  updateUser,
  deleteUser,
};