# EKE Frontend - Tutoring Platform

Ứng dụng React Native cho nền tảng gia sư trực tuyến với nhiều vai trò người dùng (Học sinh, Gia sư, Khách hàng).

## 🏗️ Cấu trúc dự án

```
src/
├── components/           # Components tái sử dụng
│   ├── common/          # Components chung (Button, Input, Card, Header, etc.)
│   ├── forms/           # Components form
│   └── navigation/      # Components navigation
├── screens/             # Màn hình ứng dụng
│   ├── auth/           # Màn hình xác thực
│   ├── onboarding/     # Màn hình onboarding
│   ├── student/        # Màn hình cho học sinh
│   ├── tutor/          # Màn hình cho gia sư
│   ├── chat/           # Màn hình chat
│   └── shared/         # Màn hình dùng chung
├── navigation/          # Cấu hình navigation
│   ├── AppNavigator.js # Navigator chính
│   └── routes.js       # Định nghĩa routes
├── services/           # API services và business logic
│   ├── api/            # API core (api.js, apiService.js, apiUtils.js)
│   ├── core/           # Core services (auth, certification, location, subject)
│   └── features/       # Feature services (booking, match, message, etc.)
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
│   ├── validation.js   # Validation functions
│   ├── format.js       # Formatting functions
│   └── storage.js      # Storage utilities
├── constants/          # Constants và configuration
│   ├── colors.js       # Color palette
│   ├── sizes.js        # Sizing constants
│   └── config.js       # App configuration
├── assets/             # Images, fonts, etc.
└── types/              # TypeScript definitions (nếu sử dụng TS)
```

## ✨ Cải tiến chính

### 1. **Tổ chức theo tính năng**

- Screens được tổ chức theo tính năng thay vì vai trò người dùng
- Dễ dàng thêm tính năng mới và bảo trì code

### 2. **Components tái sử dụng**

- `Button`, `Input`, `Card`, `Header`, `LoadingSpinner`
- Consistent styling và behavior
- Dễ dàng customize và extend

### 3. **Custom Hooks**

- `useAuth`: Quản lý trạng thái xác thực
- `useApi`: Xử lý API calls với error handling
- `useAuthenticatedApi`: API calls với token tự động

### 4. **Utility Functions**

- **Validation**: Email, phone, password validation
- **Formatting**: Currency, date, time, phone number formatting
- **Storage**: AsyncStorage wrapper với error handling

### 5. **Constants & Configuration**

- **Colors**: Consistent color palette
- **Sizes**: Spacing, font sizes, border radius
- **Config**: App-wide settings và feature flags

### 6. **Navigation Management**

- Centralized route definitions
- Navigation helper functions
- Type-safe navigation

### 7. **Services Organization**

- **API Services**: Core API functionality
- **Core Services**: Authentication, certification, location, subject
- **Feature Services**: Booking, matching, messaging, notifications, reviews, tutor management

## 🚀 Bắt đầu

### Yêu cầu hệ thống

- Node.js >= 16
- React Native CLI hoặc Expo CLI
- iOS Simulator hoặc Android Emulator

### Cài đặt

1. **Clone repository**

```bash
git clone <repository-url>
cd EKE_Frontend
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Chạy ứng dụng**

```bash
# Development
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 Tính năng

### 👨‍🎓 Học sinh

- Đăng ký/Đăng nhập
- Tìm kiếm gia sư
- Đặt lịch học
- Chat với gia sư
- Video call
- Đánh giá và feedback
- Quản lý ví tiền

### 👨‍🏫 Gia sư

- Đăng ký/Đăng nhập
- Tạo profile chi tiết
- Nhận đơn đặt lịch
- Chat với học sinh
- Video call
- Quản lý lịch dạy
- Nhận thanh toán

### 💬 Chat System

- Real-time messaging
- File sharing
- Voice messages
- Video calls
- Message history

## 🛠️ Công nghệ sử dụng

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **AsyncStorage** - Local storage
- **Axios** - HTTP client
- **React Native Vector Icons** - Icon library
- **React Native Paper** - UI components

## 📁 Migration Guide

Dự án đã được refactor từ cấu trúc cũ sang cấu trúc mới:

### Cấu trúc cũ → Cấu trúc mới

- `screens/StudentScreens/` → `src/screens/student/`
- `screens/tutor/` → `src/screens/tutor/` (giữ nguyên cho tính năng gia sư)
- `screens/customer/` → `src/screens/shared/` (cho tính năng dùng chung)
- `screens/match/` → `src/screens/chat/`
- `screens/launch/` → `src/screens/onboarding/`
- `services/*.js` → `src/services/{api,core,features}/`

### Import paths cần cập nhật

```javascript
// Cũ
import Button from "../../components/Button";
import { authService } from "../../services/authService";

// Mới
import { Button } from "../../components/common";
import { authService } from "../../services";
```

## 🔧 Development

### Code Style

- Sử dụng ESLint và Prettier
- Follow React Native best practices
- Consistent naming conventions

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Building

```bash
# Build for production
npm run build

# Build for specific platform
npm run build:ios
npm run build:android
```

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue hoặc liên hệ team development.
# Education-App
