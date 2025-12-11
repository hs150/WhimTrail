const supabase = require('./index');

// Create a blog
async function createBlog(blogData) {
  const { data, error } = await supabase
    .from('blogs')
    .insert([blogData])
    .select();

  if (error) throw error;
  return data[0];
}

// Get all blogs
async function getAllBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get blog by slug
async function getBlogBySlug(slug) {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

// Update blog
async function updateBlog(id, updates) {
  const { data, error } = await supabase
    .from('blogs')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

// Delete blog
async function deleteBlog(id) {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
