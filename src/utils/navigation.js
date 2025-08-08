/**
 * Navigation utility functions for role-based routing
 */

/**
 * Navigate to the correct home screen based on user role
 * @param {Object} navigation - React Navigation object
 * @param {string|number} role - User role (1/"Student" or 2/"Tutor")
 * @param {string} screenName - Name of the current screen for logging
 */
export const navigateToHomeByRole = (
  navigation,
  role,
  screenName = "Unknown"
) => {
  console.log(`🔍 ${screenName} - Navigation check:`);
  console.log("👤 User role:", role);
  console.log("👤 Role type:", typeof role);

  // Role mapping: 1 = Student, 2 = Tutor
  if (role === "Student" || role === 1 || role === "1") {
    console.log("✅ Navigating to StudentHome");
    navigation.replace("StudentHome");
  } else if (
    role === "Tutor" ||
    role === 2 ||
    role === "2" ||
    role === "Lecturer"
  ) {
    console.log("✅ Navigating to TutorHome");
    navigation.replace("TutorHome");
  } else if (role === 0 || role === "0" || role === "Unspecified") {
    console.log("⚠️ Unspecified role, navigating to StudentHome");
    navigation.replace("StudentHome");
  } else {
    console.log("❌ Invalid role:", role);
    console.log("⚠️ Defaulting to StudentHome");
    navigation.replace("StudentHome");
  }
};

/**
 * Check if user is a tutor
 * @param {string|number} role - User role
 * @returns {boolean}
 */
export const isTutor = (role) => {
  return role === "Tutor" || role === 2 || role === "2" || role === "Lecturer";
};

/**
 * Check if user is a student
 * @param {string|number} role - User role
 * @returns {boolean}
 */
export const isStudent = (role) => {
  return role === "Student" || role === 1 || role === "1";
};

/**
 * Get role display name
 * @param {string|number} role - User role
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
  if (isTutor(role)) return "Gia sư";
  if (isStudent(role)) return "Học sinh";
  return "Không xác định";
};
