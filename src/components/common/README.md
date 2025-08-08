# Modern UI Components - Black & White Design

Bộ component UI hiện đại cho ứng dụng EKE Education với thiết kế trắng đen minimalist và elegant, sử dụng react-icons cho tất cả icons.

## Design Philosophy

Thiết kế trắng đen hiện đại tập trung vào:

- **Minimalism**: Loại bỏ màu sắc không cần thiết
- **Typography**: Sử dụng typography rõ ràng và dễ đọc
- **Contrast**: Tương phản cao giữa trắng và đen
- **Elegance**: Thiết kế thanh lịch và chuyên nghiệp
- **Consistency**: Sử dụng react-icons nhất quán trong toàn bộ ứng dụng

## Icons System

### Icons Helper

Tất cả icons được quản lý tập trung thông qua file `Icons.js`:

```jsx
import { Icons } from '../components/common/Icons';

// Sử dụng icon
<Icons.Person size={24} color="#000000" />
<Icons.School size={48} color="#000000" />
<Icons.Rocket size={32} color="#000000" />
```

### Available Icons

#### User & Profile

- `Person` - Người dùng
- `School` - Học tập

#### Navigation & Actions

- `ArrowForward` - Mũi tên tiến
- `ArrowBack` - Mũi tên lùi
- `Close` - Đóng
- `Checkmark` - Đánh dấu
- `Add` - Thêm
- `Remove` - Xóa

#### Main Navigation

- `Home` - Trang chủ
- `Notifications` - Thông báo
- `Settings` - Cài đặt
- `LogOut` - Đăng xuất

#### Search & Filter

- `Search` - Tìm kiếm
- `Filter` - Lọc

#### Communication

- `Mail` - Email
- `Call` - Gọi điện
- `Chatbubble` - Chat đơn
- `Chatbubbles` - Chat nhiều

#### Form & Input

- `Eye` - Hiển thị mật khẩu
- `EyeOff` - Ẩn mật khẩu

#### Onboarding & Features

- `Rocket` - Tốc độ, tiến bộ
- `Bulb` - Ý tưởng, AI

Và nhiều icons khác...

### Icon Usage Examples

```jsx
// Input với icon
<Input
  label="Email"
  placeholder="Nhập email"
  leftIcon={<Icons.Mail size={20} color="#666666" />}
  value={email}
  onChangeText={setEmail}
/>

// Button với icon
<Button
  title="Gửi"
  icon={<Icons.ArrowForward size={20} color="#ffffff" />}
  iconPosition="right"
  onPress={handleSend}
/>

// Card với icon
<View style={styles.iconContainer}>
  <Icons.Person size={48} color="#000000" />
</View>
```

## Components

### 1. Button

Component button hiện đại với gradient đen và shadow.

```jsx
import Button from '../components/common/Button';

// Primary button (black gradient)
<Button
  title="Đăng nhập"
  onPress={handleLogin}
  fullWidth
/>

// Secondary button (gray gradient)
<Button
  title="Hủy"
  variant="secondary"
  onPress={handleCancel}
/>

// Outline button (black border)
<Button
  title="Tìm hiểu thêm"
  variant="outline"
  onPress={handleLearnMore}
/>

// Button với icon
<Button
  title="Gửi"
  icon={<Icons.ArrowForward size={20} color="#ffffff" />}
  iconPosition="right"
  onPress={handleSend}
/>

// Button loading
<Button
  title="Đang xử lý..."
  loading={true}
  disabled={true}
/>
```

**Props:**

- `title`: Text hiển thị trên button
- `onPress`: Function xử lý khi press
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'small' | 'medium' | 'large'
- `fullWidth`: Boolean để button full width
- `disabled`: Boolean để disable button
- `loading`: Boolean để hiển thị loading state
- `icon`: React component icon
- `iconPosition`: 'left' | 'right'

### 2. Input

Component input hiện đại với focus states và validation.

```jsx
import Input from '../components/common/Input';
import { Icons } from '../components/common/Icons';

// Basic input
<Input
  label="Email"
  placeholder="Nhập email của bạn"
  value={email}
  onChangeText={setEmail}
/>

// Password input (tự động có eye icon)
<Input
  label="Mật khẩu"
  placeholder="Nhập mật khẩu"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
/>

// Input với icon
<Input
  label="Số điện thoại"
  placeholder="Nhập số điện thoại"
  value={phone}
  onChangeText={setPhone}
  leftIcon={<Icons.Call size={20} color="#666666" />}
  keyboardType="phone-pad"
/>

// Input với error
<Input
  label="Email"
  placeholder="Nhập email"
  value={email}
  onChangeText={setEmail}
  error="Email không hợp lệ"
/>
```

**Props:**

- `label`: Label cho input
- `placeholder`: Placeholder text
- `value`: Giá trị input
- `onChangeText`: Function xử lý khi text thay đổi
- `secureTextEntry`: Boolean cho password input
- `error`: Error message
- `disabled`: Boolean để disable input
- `leftIcon`: React component icon bên trái
- `rightIcon`: React component icon bên phải
- `onRightIconPress`: Function khi press right icon
- `keyboardType`: Loại keyboard
- `multiline`: Boolean cho multiline input

### 3. Card

Component card với shadow và border radius hiện đại.

```jsx
import Card from '../components/common/Card';

// Basic card
<Card>
  <Text>Nội dung card</Text>
</Card>

// Elevated card
<Card variant="elevated" padding="large">
  <Text>Card với shadow lớn</Text>
</Card>

// Outlined card
<Card variant="outlined" padding="small">
  <Text>Card với border</Text>
</Card>

// Custom card
<Card
  backgroundColor="#f8f9fa"
  borderRadius={20}
  padding="large"
  margin={16}
>
  <Text>Card tùy chỉnh</Text>
</Card>
```

**Props:**

- `variant`: 'default' | 'elevated' | 'outlined'
- `padding`: 'none' | 'small' | 'medium' | 'large'
- `margin`: Margin cho card
- `borderRadius`: Border radius tùy chỉnh
- `backgroundColor`: Màu nền tùy chỉnh
- `shadow`: Boolean để bật/tắt shadow

### 4. LoadingSpinner

Component loading spinner với animation đẹp mắt.

```jsx
import LoadingSpinner from '../components/common/LoadingSpinner';

// Basic spinner
<LoadingSpinner />

// Spinner với size khác nhau
<LoadingSpinner size="small" />
<LoadingSpinner size="large" />

// Spinner với màu tùy chỉnh
<LoadingSpinner color="#000000" />
```

**Props:**

- `size`: 'small' | 'medium' | 'large'
- `color`: Màu của spinner

## Onboarding Screens

### SplashScreen

Màn hình splash với gradient trắng và animations.

### OnboardingScreen

Màn hình onboarding với:

- Gradient backgrounds trắng-xám thay đổi theo slide
- Pagination dots đen
- Skip button với background trong suốt
- Smooth animations
- Modern typography đen
- Icons từ react-icons (Rocket, Bulb)

### RoleSelectionScreen

Màn hình chọn vai trò với:

- Card design trắng với shadow nhẹ
- Gradient backgrounds trắng-xám
- Staggered animations
- Clear role descriptions với typography đen
- Icons từ react-icons (Person, School)

## Cài đặt

Đảm bảo đã cài đặt các dependencies:

```bash
npm install expo-linear-gradient react-icons
```

## Sử dụng

Import và sử dụng các components trong các màn hình:

```jsx
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Icons } from "../components/common/Icons";
```

## Design System

### Colors

- **Primary Black**: #000000
- **Secondary Gray**: #666666
- **Light Gray**: #999999
- **Background White**: #ffffff
- **Background Light**: #f8f9fa
- **Border Gray**: #e0e0e0
- **Error Red**: #ff0000

### Typography

- **Title**: 32px, bold, #000000
- **Subtitle**: 20px, semibold, #333333
- **Body**: 16px, regular, #000000
- **Caption**: 14px, regular, #666666
- **Letter Spacing**: 0.5-1px cho các tiêu đề

### Spacing

- Small: 8px
- Medium: 16px
- Large: 24px
- Extra Large: 32px

### Border Radius

- Small: 8px
- Medium: 12px
- Large: 20px
- Extra Large: 30px

### Shadows

- **Light**: elevation: 1, shadowOpacity: 0.1
- **Medium**: elevation: 3, shadowOpacity: 0.25
- **Heavy**: elevation: 8, shadowOpacity: 0.15

### Icons

- **Default Size**: 24px
- **Default Color**: #000000
- **Large Size**: 48px (cho cards)
- **Small Size**: 20px (cho inputs)

## Benefits

1. **Professional Look**: Thiết kế trắng đen tạo cảm giác chuyên nghiệp
2. **Better Readability**: Tương phản cao giúp dễ đọc
3. **Timeless Design**: Không bị lỗi thời theo xu hướng màu sắc
4. **Focus on Content**: Người dùng tập trung vào nội dung thay vì màu sắc
5. **Accessibility**: Dễ dàng cho người khiếm thị màu sắc
6. **Icon Consistency**: Sử dụng react-icons nhất quán trong toàn bộ ứng dụng
7. **Scalability**: Dễ dàng thêm icons mới và quản lý tập trung
