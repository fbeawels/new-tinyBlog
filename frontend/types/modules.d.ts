// This file is used to provide TypeScript type information about modules

// Multi-select component
declare module '@/components/ui/multi-select' {
  import * as React from 'react';

  export interface MultiSelectOption {
    value: string;
    label: string;
  }

  interface MultiSelectProps {
    options: MultiSelectOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
  }

  const MultiSelect: React.FC<MultiSelectProps>;
  export default MultiSelect;
}

// Category service
declare module '@/services/category-service' {
  export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    created_at: string;
    updated_at: string;
  }

  export const categoryService: {
    getCategories(): Promise<Category[]>;
    getCategoryById(id: string): Promise<Category>;
    createCategory(data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category>;
    updateCategory(id: string, data: Partial<Category>): Promise<Category>;
    deleteCategory(id: string): Promise<void>;
  };
}

// Tag service
declare module '@/services/tag-service' {
  export interface Tag {
    id: string;
    name: string;
    slug: string;
    description?: string;
    created_at: string;
    updated_at: string;
  }

  export const tagService: {
    getTags(): Promise<Tag[]>;
    getTagById(id: string): Promise<Tag>;
    createTag(data: Omit<Tag, 'id' | 'created_at' | 'updated_at'>): Promise<Tag>;
    updateTag(id: string, data: Partial<Tag>): Promise<Tag>;
    deleteTag(id: string): Promise<void>;
  };
}
