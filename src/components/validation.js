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

  export const validateContactForm = (formData) => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Valid email is required';
    }
    if (!formData.message.trim()) errors.message = 'Message is required';
    return errors;
  };
  
  export const clearcontactFieldError = (errors, field) => ({
    ...errors,
    [field]: ''
  });