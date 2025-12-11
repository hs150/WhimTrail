const supabase = require('./index');

// Create an itinerary
async function createItinerary(itineraryData) {
  const { data, error } = await supabase
    .from('itineraries')
    .insert([itineraryData])
    .select();

  if (error) throw error;
  return data[0];
}

// Get itineraries by user
async function getItinerariesByUser(userId) {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// Get itinerary by ID
async function getItineraryById(id) {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Update itinerary
async function updateItinerary(id, updates) {
  const { data, error } = await supabase
    .from('itineraries')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

// Delete itinerary
async function deleteItinerary(id) {
  const { error } = await supabase
    .from('itineraries')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  createItinerary,
  getItinerariesByUser,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
};
