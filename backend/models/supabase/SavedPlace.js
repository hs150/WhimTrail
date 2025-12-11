const supabase = require('./index');

// Create a saved place
async function createSavedPlace(savedPlaceData) {
  const { data, error } = await supabase
    .from('saved_places')
    .insert([savedPlaceData])
    .select();

  if (error) throw error;
  return data[0];
}

// Get saved places by user
async function getSavedPlacesByUser(userId) {
  const { data, error } = await supabase
    .from('saved_places')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// Update saved place
async function updateSavedPlace(id, updates) {
  const { data, error } = await supabase
    .from('saved_places')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

// Delete saved place
async function deleteSavedPlace(id) {
  const { error } = await supabase
    .from('saved_places')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  createSavedPlace,
  getSavedPlacesByUser,
  updateSavedPlace,
  deleteSavedPlace,
};
