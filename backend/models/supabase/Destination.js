const supabase = require('./index');

// Create a destination
async function createDestination(destinationData) {
  const { data, error } = await supabase
    .from('destinations')
    .insert([destinationData])
    .select();

  if (error) throw error;
  return data[0];
}

// Get all destinations
async function getAllDestinations() {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('popularity', { ascending: false });

  if (error) throw error;
  return data;
}

// Get destination by ID
async function getDestinationById(id) {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Update destination
async function updateDestination(id, updates) {
  const { data, error } = await supabase
    .from('destinations')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

// Delete destination
async function deleteDestination(id) {
  const { error } = await supabase
    .from('destinations')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
};
