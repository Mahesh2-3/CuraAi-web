export const storage = {
  async set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  async get<T>(key: string): Promise<T | null> {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  async remove(key: string) {
    localStorage.removeItem(key);
  },
};
