const supabase = require('./index');

// Create a review
async function createReview(reviewData) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select();

  if (error) throw error;
  return data[0];
}

// Get reviews by user
async function getReviewsByUser(userId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// Get reviews for a destination
async function getReviewsByDestination(destinationId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('destination_id', destinationId);

  if (error) throw error;
  return data;
}

// Update review
async function updateReview(id, updates) {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

// Delete review
async function deleteReview(id) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  createReview,
  getReviewsByUser,
  getReviewsByDestination,
  updateReview,
  deleteReview,
};
