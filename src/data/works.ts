import { WorkItem } from '../types';
import { portfolioService } from '../utils/portfolioService';

// Default/demo work items
const defaultWorkItems: WorkItem[] = [
  
];

// Helper function to filter out test items
const filterTestItems = (items: any[]): WorkItem[] => {
  const testPatterns = [
    /test/i,
    /\[deleting\]/i,
    /deletion/i,
    /permission/i,
    /🧪/,
    /🗑️/,
    /TEST/,
    /DELETING/,
    /DELETION/,
    /PERMISSION/
  ];
  
  return items.filter(item => {
    return !testPatterns.some(pattern => 
      pattern.test(item.title) || 
      pattern.test(item.category) || 
      pattern.test(item.description || '')
    );
  });
};

// Get all work items (default + uploaded from Supabase, excluding test items)
export const getWorkItems = async (): Promise<WorkItem[]> => {
  try {
    const supabaseItems = await portfolioService.getAll();
    
    // Convert Supabase items to WorkItem format and filter out test items
    const convertedItems: WorkItem[] = filterTestItems(supabaseItems).map(item => ({
      id: item.id,
      title: item.title,
      views: item.views,
      thumbnail: item.thumbnail,
      youtubeUrl: item.youtube_url || item.cloudinary_url || '#',
      category: item.category as WorkItem['category']
    }));

    // Combine uploaded items with default items
    return [...convertedItems, ...defaultWorkItems];
  } catch (error) {
    console.error('Error fetching work items:', error);
    // Return default items if there's an error
    return defaultWorkItems;
  }
};

// Synchronous function that returns default items immediately
export const getDefaultWorkItems = (): WorkItem[] => {
  return defaultWorkItems;
};

// For backward compatibility - now returns default items synchronously
export const workItems = defaultWorkItems;