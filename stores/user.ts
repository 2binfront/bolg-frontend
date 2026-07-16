export const useUserStore = defineStore('userStore', {
  state: () => ({
    username: 'hh',
    access_token: '',
    exp: '',
    canEdit: false,
    isLoginShow: false,
  }),
  persist: process.client && {
    storage: sessionStorage,
  },
  actions: {
    setUser(user: any) {
      this.username = user.username;
      this.access_token = user.access_token;
      this.exp = user.exp;
    },
    async checkAuth() {
      try {
        const res: any = await $fetch('/api/blog/auth/profile', {
          method: 'get',
          headers: {
            Authorization: `Bearer ${this.access_token}`,
          },
        });

        if (res.exp && res.exp > new Date().getTime() / 1000) {
          this.canEdit = true;
        } else {
          this.canEdit = false;
        }
      } catch (error) {
        this.canEdit = false;
        this.access_token = '';
        this.exp = '';
      }
    },
  },
});
