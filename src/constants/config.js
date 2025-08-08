// App configuration
export const APP_CONFIG = {
  // App information
  APP_NAME: "EKE Frontend",
  APP_VERSION: "1.0.0",

  // API configuration
  API_BASE_URL: "https://api.eke.com", // Replace with your actual API URL
  API_TIMEOUT: 30000, // 30 seconds

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,

  // File upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ],

  // Chat configuration
  MESSAGE_PAGE_SIZE: 20,
  TYPING_TIMEOUT: 3000, // 3 seconds

  // Video call configuration
  VIDEO_CALL_TIMEOUT: 300000, // 5 minutes

  // Cache configuration
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes

  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng thử lại.",
    SERVER_ERROR: "Lỗi máy chủ. Vui lòng thử lại sau.",
    UNAUTHORIZED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
    FORBIDDEN: "Bạn không có quyền truy cập tính năng này.",
    NOT_FOUND: "Không tìm thấy dữ liệu.",
    VALIDATION_ERROR: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
    UNKNOWN_ERROR: "Có lỗi xảy ra. Vui lòng thử lại.",
  },

  // Success messages
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: "Đăng nhập thành công!",
    REGISTER_SUCCESS: "Đăng ký thành công!",
    UPDATE_SUCCESS: "Cập nhật thành công!",
    DELETE_SUCCESS: "Xóa thành công!",
    SAVE_SUCCESS: "Lưu thành công!",
    SEND_SUCCESS: "Gửi thành công!",
  },

  // Validation rules
  VALIDATION_RULES: {
    EMAIL: {
      required: "Email là bắt buộc",
      invalid: "Email không hợp lệ",
    },
    PASSWORD: {
      required: "Mật khẩu là bắt buộc",
      minLength: "Mật khẩu phải có ít nhất 6 ký tự",
      invalid: "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số",
    },
    PHONE: {
      required: "Số điện thoại là bắt buộc",
      invalid: "Số điện thoại không hợp lệ",
    },
    NAME: {
      required: "Tên là bắt buộc",
      minLength: "Tên phải có ít nhất 2 ký tự",
    },
  },

  // Default values
  DEFAULTS: {
    LANGUAGE: "vi",
    THEME: "light",
    NOTIFICATIONS_ENABLED: true,
    AUTO_PLAY_VIDEO: false,
    SOUND_ENABLED: true,
  },

  // Feature flags
  FEATURES: {
    VIDEO_CALL: true,
    VOICE_MESSAGE: true,
    FILE_SHARING: true,
    PUSH_NOTIFICATIONS: true,
    DARK_MODE: true,
    MULTI_LANGUAGE: true,
  },
};

// Environment-specific configuration
export const getConfig = () => {
  const environment = process.env.NODE_ENV || "development";

  const configs = {
    development: {
      ...APP_CONFIG,
      API_BASE_URL: "http://localhost:3000/api",
      DEBUG_MODE: true,
    },
    staging: {
      ...APP_CONFIG,
      API_BASE_URL: "https://staging-api.eke.com",
      DEBUG_MODE: false,
    },
    production: {
      ...APP_CONFIG,
      API_BASE_URL: "https://api.eke.com",
      DEBUG_MODE: false,
    },
  };

  return configs[environment] || configs.development;
};
