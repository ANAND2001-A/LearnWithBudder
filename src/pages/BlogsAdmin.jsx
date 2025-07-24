// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../context/FirebaseContext';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';

function BlogsAdmin() {
  const { currentUser } = useAuth();
  const { addBlog } = useFirebase();
  const [blogForm, setBlogForm] = useState({
    title: "",
    category: "",
    tags: [],
    content: "",
    metaTitle: "",
    metaDescription: "",
    slug: "",
    status: "draft",
    publishDate: "",
    isFeatured: false,
    author: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    "Technology",
    "Design",
    "Business",
    "Marketing",
    "Development",
    "Lifestyle",
  ];
  const authors = ["John Smith", "Sarah Johnson", "Mike Chen", "Emma Davis"];

  const handleInputChange = (field, value) => {
    setBlogForm((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !blogForm.tags.includes(tagInput.trim())) {
      setBlogForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setBlogForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setImagePreview(event.target.result.toString());
        }
      };
      reader.onerror = () => setImagePreview(null); // Handle error case
      reader.readAsDataURL(file);
    }
  };

  const wordCount = blogForm.content
    .split(" ")
    .filter((word) => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await addBlog({
        ...blogForm,
        createdAt: '2025-07-24T11:20:00Z', // 04:50 PM IST converted to UTC
        createdBy: currentUser.email,
        imagePreview: imagePreview || '',
      });
      setBlogForm({
        title: "",
        category: "",
        tags: [],
        content: "",
        metaTitle: "",
        metaDescription: "",
        slug: "",
        status: "draft",
        publishDate: "",
        isFeatured: false,
        author: "",
      });
      setTagInput("");
      setImagePreview(null);
      alert('Blog added successfully!');
    } catch (err) {
      console.error('Error adding blog:', err);
      alert('Failed to add blog: ' + err.message);
    }
  };

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Animation */}
      <div className="bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-2">
            {/* Animated Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 animate-fade-in">
              <a href="#" className="hover:text-gray-700 transition-colors">
                Blog Management
              </a>
              <i className="fas fa-chevron-right text-xs"></i>
              <span className="text-gray-900 font-medium">Add New Blog</span>
            </nav>
            <h1 className="text-4xl font-extrabold text-gray-900 animate-slide-up">
              Add New Blog
            </h1>
            <p className="text-lg text-gray-600 animate-slide-up delay-100">
              Create and publish engaging content for your audience
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Blog Details Section with Card Style */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
                Blog Details
              </h2>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  placeholder="Enter your blog post title..."
                  required
                />
              </div>

              {/* Category and Tags Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={blogForm.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none cursor-pointer bg-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Add tags..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                      <i className="fas fa-plus text-gray-600"></i>
                    </button>
                  </div>
                  {blogForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {blogForm.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-blue-600 cursor-pointer"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 cursor-pointer transition-colors"
                      >
                        <i className="fas fa-times text-sm"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-4"></i>
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop your image here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <div className="border border-gray-300 rounded-lg">
                  {/* Toolbar */}
                  <div className="flex items-center space-x-1 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                    >
                      <i className="fas fa-bold text-gray-600"></i>
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                    >
                      <i className="fas fa-italic text-gray-600"></i>
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                    >
                      <i className="fas fa-underline text-gray-600"></i>
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                    >
                      <i className="fas fa-list-ul text-gray-600"></i>
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                    >
                      <i className="fas fa-list-ol text-gray-600"></i>
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                    >
                      <i className="fas fa-link text-gray-600"></i>
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                    >
                      <i className="fas fa-image text-gray-600"></i>
                    </button>
                  </div>

                  <textarea
                    value={blogForm.content}
                    onChange={(e) =>
                      handleInputChange("content", e.target.value)
                    }
                    rows={12}
                    className="w-full p-4 border-none resize-none focus:ring-0 focus:outline-none text-sm rounded-b-lg"
                    placeholder="Start writing your blog post content here..."
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{wordCount} words</span>
                  <span>~{readingTime} min read</span>
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">
                SEO Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={blogForm.metaTitle}
                    onChange={(e) =>
                      handleInputChange("metaTitle", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    placeholder="Enter SEO title..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 50-60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={blogForm.metaDescription}
                    onChange={(e) =>
                      handleInputChange("metaDescription", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    placeholder="Enter meta description..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 150-160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                      /blog/
                    </span>
                    <input
                      type="text"
                      value={blogForm.slug}
                      onChange={(e) =>
                        handleInputChange("slug", e.target.value)
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                      placeholder="url-slug"
                    />
                  </div>
                </div>

                {/* SEO Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Search Preview
                  </h3>
                  <div className="space-y-1">
                    <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                      {blogForm.metaTitle ||
                        blogForm.title ||
                        "Your Blog Post Title"}
                    </div>
                    <div className="text-green-700 text-sm">
                      https://yoursite.com/blog/
                      {blogForm.slug || "your-blog-post"}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {blogForm.metaDescription ||
                        "Your meta description will appear here..."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Publishing Options
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={blogForm.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none cursor-pointer bg-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="datetime-local"
                    value={blogForm.publishDate}
                    onChange={(e) =>
                      handleInputChange("publishDate", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <div className="relative">
                    <select
                      value={blogForm.author}
                      onChange={(e) =>
                        handleInputChange("author", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none cursor-pointer bg-white"
                    >
                      <option value="">Select author</option>
                      {authors.map((author) => (
                        <option key={author} value={author}>
                          {author}
                        </option>
                      ))}
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Featured Post
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange("isFeatured", !blogForm.isFeatured)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      blogForm.isFeatured ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        blogForm.isFeatured ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Completion Status
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={
                      blogForm.title ? "text-green-600" : "text-gray-500"
                    }
                  >
                    <i
                      className={`fas ${blogForm.title ? "fa-check-circle" : "fa-circle"} mr-2`}
                    ></i>
                    Title
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={
                      blogForm.content ? "text-green-600" : "text-gray-500"
                    }
                  >
                    <i
                      className={`fas ${blogForm.content ? "fa-check-circle" : "fa-circle"} mr-2`}
                    ></i>
                    Content
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={
                      blogForm.category ? "text-green-600" : "text-gray-500"
                    }
                  >
                    <i
                      className={`fas ${blogForm.category ? "fa-check-circle" : "fa-circle"} mr-2`}
                    ></i>
                    Category
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={
                      imagePreview ? "text-green-600" : "text-gray-500"
                    }
                  >
                    <i
                      className={`fas ${imagePreview ? "fa-check-circle" : "fa-circle"} mr-2`}
                    ></i>
                    Featured Image
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <i className="fas fa-eye mr-2"></i>
            Preview
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
          >
            <i className="fas fa-save mr-2"></i>
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleBlogSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
          >
            <i className="fas fa-paper-plane mr-2"></i>
            Publish Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogsAdmin;