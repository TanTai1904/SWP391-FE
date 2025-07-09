let currentId = 1; // Bắt đầu từ 1 và tăng dần

// Tạo danh sách bác sĩ với id tăng dần
const doctors = Array.from({ length: 5 }, () => ({
  id: currentId++,
  username: `doctor${currentId - 1}`,
  password: "123456",
  role: "Doctor",
}));

// Thêm các user khác với id tự tăng
const mockUsers = [
  { id: currentId++, username: "admin1", password: "123456", role: "Admin" },
  { id: currentId++, username: "manager1", password: "123456", role: "Manager" },
  ...doctors,
];

const mockAuthService = {
  login: async (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(
          (u) => u.username === username && u.password === password
        );

        if (foundUser) {
          const { password, ...userData } = foundUser;

          const token = "mock-token-" + btoa(`${userData.username}:${userData.role}`);
          // Store with consistent field names
          const userToStore = {
            username: userData.username,
            role: userData.role,
            id: userData.id
          };
          localStorage.setItem("user", JSON.stringify(userToStore));
          localStorage.setItem("token", token);

          resolve(userToStore);
        } else {
          reject(new Error("Tài khoản hoặc mật khẩu không đúng!"));
        }
      }, 500);
    });
  },

  register: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = mockUsers.find((u) => u.username === userData.username);
        if (exists) {
          reject(new Error("Tên đăng nhập đã tồn tại!"));
        } else {
          const newUser = {
            ...userData,
            id: currentId++, // Gán id mới rồi ++
          };
          mockUsers.push(newUser);
          resolve({ success: true, message: "Đăng ký thành công (giả lập)", user: newUser });
        }
      }, 500);
    });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export default mockAuthService;
