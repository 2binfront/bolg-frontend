export const useUserStore = defineStore('userStore', {
  state: () => ({
    username: 'hh',
    access_token: '',
    exp: '',
    canEdit: false,
  }),
  persist: process.client && {
    // 仅在客户端使用
    storage: localStorage, // localStorage 本地存储，可替换sessionStorage
  },
  actions: {
    setUser(user: any) {
      this.username = user.username;
      this.access_token = user.access_token;
      this.exp = user.exp;
    },
    async checkAuth() {
      const res: any = await $fetch('/api/blog/auth/profile', {
        method: 'get',
        headers: {
          Authorization: `Bearer ${this.access_token}`,
        },
      });
      if (res.exp && res.exp > new Date().getTime() / 1000) {
        this.canEdit = true;
      }
    },
  },
});
