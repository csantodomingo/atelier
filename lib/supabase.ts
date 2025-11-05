import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (safe to use in browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type ClothingItem = {
    id: string;
    user_id: string;
    name: string;
    category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear';
    color: string;
    description: string;
    image_url: string;
    ai_tags: string[];
    created_at: string;
};

export type Outfit = {
    id: string;
    user_id: string;
    prompt: string;
    clothing_item_ids: string[];
    image_urls: string[];
    created_at: string;
};