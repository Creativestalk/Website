// Portfolio storage utility for managing portfolio items
export interface PortfolioItem {
    id: string;
    title: string;
    category: string;
    description?: string;
    youtubeUrl?: string;
    thumbnail: string;
    views?: string;
    uploadedAt: string;
  }
  
  const STORAGE_KEY = 'creativestalk_portfolio';
  
  export const portfolioStorage = {
    // Get all portfolio items
    getAll: (): PortfolioItem[] => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Error reading portfolio data:', error);
        return [];
      }
    },
  
    // Add new portfolio item
    add: (item: Omit<PortfolioItem, 'id' | 'uploadedAt'>): PortfolioItem => {
      const newItem: PortfolioItem = {
        ...item,
        id: `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        uploadedAt: new Date().toISOString()
      };
  
      const items = portfolioStorage.getAll();
      items.unshift(newItem); // Add to beginning
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        return newItem;
      } catch (error) {
        console.error('Error saving portfolio item:', error);
        throw new Error('Failed to save portfolio item');
      }
    },
  
    // Remove portfolio item
    remove: (id: string): boolean => {
      try {
        const items = portfolioStorage.getAll();
        const filteredItems = items.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
        return true;
      } catch (error) {
        console.error('Error removing portfolio item:', error);
        return false;
      }
    },
  
    // Update portfolio item
    update: (id: string, updates: Partial<PortfolioItem>): boolean => {
      try {
        const items = portfolioStorage.getAll();
        const index = items.findIndex(item => item.id === id);
        
        if (index === -1) return false;
        
        items[index] = { ...items[index], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        return true;
      } catch (error) {
        console.error('Error updating portfolio item:', error);
        return false;
      }
    },
  
    // Clear all items (for testing)
    clear: (): void => {
      localStorage.removeItem(STORAGE_KEY);
    }
  };