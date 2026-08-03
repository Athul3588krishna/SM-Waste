/**
 * Input Payload Validators for User Authentication and Complaint Submissions
 */

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validateComplaintInput = ({ category, address, latitude, longitude }) => {
  const errors = [];

  if (!category || category.trim() === '') {
    errors.push('Waste category is required');
  }

  if (!address || address.trim() === '') {
    errors.push('Location address description is required');
  }

  if (latitude === undefined || longitude === undefined || isNaN(latitude) || isNaN(longitude)) {
    errors.push('Valid map coordinates (latitude and longitude) are required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validateComplaintInput,
};
