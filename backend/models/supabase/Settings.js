const supabase = require('./index');

// Create settings
async function createSettings(settingsData) {
  const { data, error } = await supabase
    .from('settings')
    .insert([settingsData])
    .select();

  if (error) throw error;
  return data[0];
}

// Get settings by user
async function getSettingsByUser(userId) {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Update settings
async function updateSettings(userId, updates) {
  const { data, error } = await supabase
    .from('settings')
    .update(updates)
    .eq('user_id', userId)
    .select();

  if (error) throw error;
  return data[0];
}

// Delete settings
async function deleteSettings(userId) {
  const { error } = await supabase
    .from('settings')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
  return true;
}

module.exports = {
  createSettings,
  getSettingsByUser,
  updateSettings,
  deleteSettings,
};
