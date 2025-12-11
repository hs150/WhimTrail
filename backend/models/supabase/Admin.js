const supabase = require('../config/supabase');

// Create a new admin
async function createAdmin(data) {
  const { data: admin, error } = await supabase
    .from('admins')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return admin;
}

// Get admin by ID
async function getAdminById(id) {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Get admins by userId
async function getAdminsByUser(userId) {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('userId', userId);

  if (error) throw error;
  return data;
}

// Update admin role
async function updateAdminRole(id, role) {
  const { data, error } = await supabase
    .from('admins')
    .update({ role })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete admin
async function deleteAdmin(id) {
  const { error } = await supabase
    .from('admins')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  createAdmin,
  getAdminById,
  getAdminsByUser,
  updateAdminRole,
  deleteAdmin
};