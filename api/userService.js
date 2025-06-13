// api/userService.js
class UserService {
  static #loadUsers() {
    return JSON.parse(localStorage.getItem("vms_users")) || [];
  }

  static #saveUsers(users) {
    localStorage.setItem("vms_users", JSON.stringify(users));
  }

  // Generate a unique ID for VMS system users (admin, guard, host)
  static #generateUserId() {
    // Current timestamp + a random alphanumeric string
    return `USR-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 11)
      .toUpperCase()}`;
  }

  static async fetchUsers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allUsers = UserService.#loadUsers();
        // Filter to only include VMS system users (admin, guard, host) for admin management
        const systemUsers = allUsers.filter(
          (user) =>
            user.role === "admin" ||
            user.role === "guard" ||
            user.role === "host"
        );
        resolve([...systemUsers]);
      }, 300);
    });
  }

  static async createUser(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let allUsers = UserService.#loadUsers();

        if (
          allUsers.some(
            (u) =>
              (u.role === "admin" || u.role === "guard" || u.role === "host") &&
              u.email === userData.email
          )
        ) {
          reject(new Error("User with this email already exists."));
          return;
        }

        const newUser = {
          id: UserService.#generateUserId(),
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          verified: true,
        };

        allUsers.push(newUser);
        UserService.#saveUsers(allUsers);
        console.log("User created:", newUser);
        resolve(newUser);
      }, 300);
    });
  }

  static async updateUser(userId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let allUsers = UserService.#loadUsers();
        const index = allUsers.findIndex((user) => user.id === userId);

        if (index === -1) {
          reject(new Error("User not found"));
          return;
        }

        if (updates.email && updates.email !== allUsers[index].email) {
          if (
            allUsers.some(
              (u) =>
                (u.role === "admin" ||
                  u.role === "guard" ||
                  u.role === "host") &&
                u.email === updates.email &&
                u.id !== userId
            )
          ) {
            reject(
              new Error("Another system user with this email already exists.")
            );
            return;
          }
        }

        const updatedUser = { ...allUsers[index], ...updates };
        // If password is provided, update it. Otherwise, keep the old one.
        if (updates.password === "") {
          // Treat empty password field as "do not change"
          delete updatedUser.password;
          updatedUser.password = allUsers[index].password; // Keep old password
        } else if (updates.password) {
          updatedUser.password = updates.password;
        } else {
          updatedUser.password = allUsers[index].password;
        }

        allUsers[index] = updatedUser;
        UserService.#saveUsers(allUsers);
        console.log("User updated:", updatedUser);
        resolve(updatedUser);
      }, 300);
    });
  }

  static async deleteUser(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let allUsers = UserService.#loadUsers();
        const initialLength = allUsers.length;
        const filteredUsers = allUsers.filter(
          (user) => user.id !== userId || user.role === "visitor"
        );

        if (filteredUsers.length === initialLength) {
          reject(
            new Error(
              "User not found or is a visitor and cannot be deleted from this interface."
            )
          );
          return;
        }

        UserService.#saveUsers(filteredUsers);
        console.log("User deleted:", userId);
        resolve({ success: true, userId });
      }, 300);
    });
  }
}

export default UserService;
