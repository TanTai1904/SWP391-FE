// Service kết nối API User cho Admin
export async function getAllUsers(token) {
  const res = await fetch("/api/User/All", {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Lỗi lấy danh sách user");
  return res.json();
}

export async function createUser(data, token) {
  const res = await fetch("/api/User/Create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Lỗi tạo user");
  return res.json();
}

export async function updateUser(data, token) {
  const res = await fetch("/api/User/Update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Lỗi cập nhật user");
  return res.json();
}

export async function deleteUser(id, token) {
  const res = await fetch(`/api/User/Delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Lỗi xóa user");
  return res.json();
}
