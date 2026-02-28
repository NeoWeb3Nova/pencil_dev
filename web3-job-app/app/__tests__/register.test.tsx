import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import RegisterScreen from '../register';
import { useAuthStore } from '@/store/authStore';
import { useThemedColors } from '@/lib/useThemedColors';
import { router } from 'expo-router';
import { Alert } from 'react-native';

// Mock the auth store
jest.mock('@/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock themed colors
jest.mock('@/lib/useThemedColors', () => ({
  useThemedColors: jest.fn(),
}));

// Mock router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

describe('RegisterScreen', () => {
  const mockRegister = jest.fn();
  const mockColors = {
    background: '#ffffff',
    primary: '#007AFF',
    secondary: '#8E8E93',
    dark: '#000000',
    gray300: '#d1d1d6',
    danger: '#FF3B30',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as jest.Mock).mockReturnValue({
      register: mockRegister,
      isLoading: false,
    });
    (useThemedColors as jest.Mock).mockReturnValue(mockColors);
  });

  it('should render register form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    expect(getByPlaceholderText('请输入姓名')).toBeTruthy();
    expect(getByPlaceholderText('请输入邮箱地址')).toBeTruthy();
    expect(getByPlaceholderText('请输入密码')).toBeTruthy();
    expect(getByPlaceholderText('请再次输入密码')).toBeTruthy();
    expect(getByText('创建账号')).toBeTruthy();
    expect(getByText('已有账号？')).toBeTruthy();
    expect(getByText('去登录')).toBeTruthy();
  });

  it('should show validation errors for empty fields', async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    // Try to submit without filling any fields
    const registerButton = getByText('创建账号');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(getByText('姓名不能为空')).toBeTruthy();
      expect(getByText('邮箱不能为空')).toBeTruthy();
      expect(getByText('密码不能为空')).toBeTruthy();
      expect(getByText('请确认密码')).toBeTruthy();
    });
  });

  it('should show error for invalid email format', async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    // Fill in name
    const nameInput = getByPlaceholderText('请输入姓名');
    fireEvent.changeText(nameInput, '张三');

    // Fill in invalid email
    const emailInput = getByPlaceholderText('请输入邮箱地址');
    fireEvent.changeText(emailInput, 'invalid-email');

    // Fill in password
    const passwordInput = getByPlaceholderText('请输入密码');
    fireEvent.changeText(passwordInput, 'Password123');

    // Fill in confirm password
    const confirmPasswordInput = getByPlaceholderText('请再次输入密码');
    fireEvent.changeText(confirmPasswordInput, 'Password123');

    // Try to submit
    const registerButton = getByText('创建账号');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(getByText('请输入有效的邮箱地址')).toBeTruthy();
    });
  });

  it('should show error for weak password', async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    // Fill in name
    const nameInput = getByPlaceholderText('请输入姓名');
    fireEvent.changeText(nameInput, '张三');

    // Fill in email
    const emailInput = getByPlaceholderText('请输入邮箱地址');
    fireEvent.changeText(emailInput, 'test@example.com');

    // Fill in weak password (only lowercase)
    const passwordInput = getByPlaceholderText('请输入密码');
    fireEvent.changeText(passwordInput, 'weakpassword');

    // Fill in confirm password
    const confirmPasswordInput = getByPlaceholderText('请再次输入密码');
    fireEvent.changeText(confirmPasswordInput, 'weakpassword');

    // Try to submit
    const registerButton = getByText('创建账号');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(getByText('密码必须包含大小写字母和数字')).toBeTruthy();
    });
  });

  it('should show error for password mismatch', async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    // Fill in name
    const nameInput = getByPlaceholderText('请输入姓名');
    fireEvent.changeText(nameInput, '张三');

    // Fill in email
    const emailInput = getByPlaceholderText('请输入邮箱地址');
    fireEvent.changeText(emailInput, 'test@example.com');

    // Fill in password
    const passwordInput = getByPlaceholderText('请输入密码');
    fireEvent.changeText(passwordInput, 'Password123');

    // Fill in different confirm password
    const confirmPasswordInput = getByPlaceholderText('请再次输入密码');
    fireEvent.changeText(confirmPasswordInput, 'Password456');

    // Try to submit
    const registerButton = getByText('创建账号');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(getByText('两次输入的密码不一致')).toBeTruthy();
    });
  });

  it('should call register with valid data', async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    mockRegister.mockResolvedValue({ success: true });

    // Fill in valid data
    fireEvent.changeText(getByPlaceholderText('请输入姓名'), '张三');
    fireEvent.changeText(getByPlaceholderText('请输入邮箱地址'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('请输入密码'), 'Password123');
    fireEvent.changeText(getByPlaceholderText('请再次输入密码'), 'Password123');

    // Submit
    const registerButton = getByText('创建账号');
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
        name: '张三',
      });
    });
  });

  it('should navigate back on successful registration', async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    mockRegister.mockResolvedValue({ success: true });

    // Fill in valid data
    fireEvent.changeText(getByPlaceholderText('请输入姓名'), '张三');
    fireEvent.changeText(getByPlaceholderText('请输入邮箱地址'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('请输入密码'), 'Password123');
    fireEvent.changeText(getByPlaceholderText('请再次输入密码'), 'Password123');

    // Submit
    fireEvent.press(getByText('创建账号'));

    await waitFor(() => {
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('should show error alert on registration failure', async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    mockRegister.mockResolvedValue({
      success: false,
      error: 'Email already registered',
    });

    // Fill in valid data
    fireEvent.changeText(getByPlaceholderText('请输入姓名'), '张三');
    fireEvent.changeText(getByPlaceholderText('请输入邮箱地址'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('请输入密码'), 'Password123');
    fireEvent.changeText(getByPlaceholderText('请再次输入密码'), 'Password123');

    // Submit
    fireEvent.press(getByText('创建账号'));

    await waitFor(() => {
      expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
        '注册失败',
        'Email already registered'
      );
    });
  });

  it('should navigate to login screen when pressing login link', () => {
    const { getByText } = render(<RegisterScreen />);

    const loginLink = getByText('去登录');
    fireEvent.press(loginLink);

    expect(router.push).toHaveBeenCalledWith('/login');
  });

  it('should toggle password visibility', () => {
    const { getByPlaceholderText, getByTestId } = render(<RegisterScreen />);

    const passwordInput = getByPlaceholderText('请输入密码');
    // The toggle button should exist
    const toggleButton = passwordInput.parent?.parent?.findAllByType(
      require('react-native').TouchableOpacity
    )[0];
    expect(toggleButton).toBeTruthy();
  });

  it('should show name too short error', async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    // Fill in single character name
    const nameInput = getByPlaceholderText('请输入姓名');
    fireEvent.changeText(nameInput, '张');

    // Fill in valid email and password
    fireEvent.changeText(getByPlaceholderText('请输入邮箱地址'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('请输入密码'), 'Password123');
    fireEvent.changeText(getByPlaceholderText('请再次输入密码'), 'Password123');

    // Try to submit
    fireEvent.press(getByText('创建账号'));

    await waitFor(() => {
      expect(getByText('姓名至少 2 个字符')).toBeTruthy();
    });
  });
});
