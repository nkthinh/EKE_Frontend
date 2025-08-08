# Services Directory

Thư mục này chứa tất cả các API services và business logic của ứng dụng, được tổ chức theo chức năng.

## 📁 Cấu trúc

```
services/
├── api/                 # API Core Services
│   ├── api.js          # Base API configuration
│   ├── apiService.js   # Main API service class
│   ├── apiUtils.js     # API utility functions
│   └── index.js        # API exports
├── core/               # Core Services
│   ├── authService.js      # Authentication service
│   ├── certificationService.js # Certification service
│   ├── locationService.js      # Location service
│   ├── subjectService.js       # Subject service
│   └── index.js               # Core exports
├── features/           # Feature Services
│   ├── bookingService.js      # Booking management
│   ├── matchService.js        # Matching service
│   ├── messageService.js      # Messaging service
│   ├── notificationService.js # Notification service
│   ├── reviewService.js       # Review service
│   ├── tutorService.js        # Tutor management
│   └── index.js               # Feature exports
└── index.js            # Main services export
```

## 🔧 Cách sử dụng

### Import tất cả services

```javascript
import {
  authService,
  tutorService,
  messageService,
  // ... other services
} from "../services";
```

### Import từng nhóm services

```javascript
// API services
import { apiService, apiUtils } from "../services/api";

// Core services
import { authService, locationService } from "../services/core";

// Feature services
import { bookingService, matchService } from "../services/features";
```

## 📋 Danh sách Services

### API Services (`/api`)

- **api.js**: Base API configuration và setup
- **apiService.js**: Main API service class với methods chung
- **apiUtils.js**: Utility functions cho API calls

### Core Services (`/core`)

- **authService.js**: Xác thực, đăng nhập, đăng ký
- **certificationService.js**: Quản lý chứng chỉ
- **locationService.js**: Quản lý địa điểm
- **subjectService.js**: Quản lý môn học

### Feature Services (`/features`)

- **bookingService.js**: Quản lý đặt lịch học
- **matchService.js**: Tìm kiếm và ghép cặp gia sư-học sinh
- **messageService.js**: Quản lý tin nhắn và chat
- **notificationService.js**: Quản lý thông báo
- **reviewService.js**: Quản lý đánh giá và feedback
- **tutorService.js**: Quản lý thông tin gia sư

## 🚀 Best Practices

1. **Consistent Naming**: Tất cả services đều kết thúc bằng `Service`
2. **Error Handling**: Mỗi service đều có error handling riêng
3. **Type Safety**: Sử dụng JSDoc hoặc TypeScript cho type safety
4. **Testing**: Mỗi service nên có unit tests
5. **Documentation**: Mỗi method cần có documentation rõ ràng

## 🔄 Migration Notes

Các services đã được di chuyển từ thư mục gốc `src/` vào thư mục `services/` và được tổ chức lại theo chức năng:

- **API-related**: → `/api`
- **Core functionality**: → `/core`
- **Business features**: → `/features`

Import paths cần được cập nhật từ:

```javascript
import { authService } from "../authService";
```

Thành:

```javascript
import { authService } from "../services";
```
