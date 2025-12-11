const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog
} = require('../models/supabase/Blog');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Create blog (admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags } = req.body;
    const slug = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    const blog = await createBlog({
      title,
      slug,
      content,
      excerpt,
      author_id: req.userId,
      category,
      tags,
      status: 'published',
      published_at: new Date()
    });

    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
});

// Get all published blogs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const blogs = await getAllBlogs();
    const filtered = category
      ? blogs.filter(b => b.category === category && b.status === 'published')
      : blogs.filter(b => b.status === 'published');

    const total = filtered.length;
    const offset = (Number(page) - 1) * Number(limit);
    const paginated = filtered.slice(offset, offset + Number(limit));

    res.status(200).json({
      blogs: paginated,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

// Get single blog
router.get('/:slug', async (req, res) => {
  try {
    const blog = await getBlogBySlug(req.params.slug);
    if (!blog || blog.status !== 'published') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
});

// Like blog - not implemented yet
router.post('/:blogId/like', verifyToken, async (req, res) => {
  res.status(501).json({ message: 'Like feature not implemented for Supabase backend yet' });
});

// Add comment - not implemented yet
router.post('/:blogId/comment', verifyToken, async (req, res) => {
  res.status(501).json({ message: 'Comments not implemented for Supabase backend yet' });
});

// Update blog
router.put('/:blogId', verifyAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags } = req.body;
    const updated = await updateBlog(req.params.blogId, {
      title,
      content,
      excerpt,
      category,
      tags
    });

    if (!updated) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({ message: 'Blog updated successfully', blog: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
});

// Delete blog
router.delete('/:blogId', verifyAdmin, async (req, res) => {
  try {
    const success = await deleteBlog(req.params.blogId);
    if (!success) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
});

module.exports = router;
