export const validateCourseForm = (formData, curriculum, requirements, learningOutcomes) => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Course Title is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.description.trim()) errors.description = 'Course Description is required';
    return errors;
  };
  
  export const clearFieldError = (errors, field) => ({
    ...errors,
    [field]: ''
  });