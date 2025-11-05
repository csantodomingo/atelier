'use client';

import { useState, useEffect } from 'react';
import { Upload, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { ClothingItem } from '@/lib/supabase';

export default function WardrobePage() {
    const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [userId, setUserId] = useState<string>('');

    // For demo purposes, we'll use a temporary user ID
    // In production, you'd get this from Supabase Auth
    useEffect(() => {
        const tempUserId = localStorage.getItem('tempUserId') || crypto.randomUUID();
        localStorage.setItem('tempUserId', tempUserId);
        setUserId(tempUserId);
        fetchWardrobe(tempUserId);
    }, []);

    const fetchWardrobe = async (uid: string) => {
        try {
            const response = await fetch(`/api/wardrobe?userId=${uid}`);
            const data = await response.json();
            if (data.success) {
                setWardrobeItems(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching wardrobe:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('clothing-images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('clothing-images')
                .getPublicUrl(fileName);

            // Analyze with AI
            const response = await fetch('/api/analyze-clothing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageUrl: urlData.publicUrl,
                    userId,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setWardrobeItems([result.data, ...wardrobeItems]);
            } else {
                alert('Failed to analyze clothing: ' + result.error);
            }
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Failed to upload image. Make sure Supabase storage bucket is set up.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (itemId: string) => {
        if (!confirm('Delete this item?')) return;

        try {
            const response = await fetch(`/api/wardrobe?itemId=${itemId}&userId=${userId}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.success) {
                setWardrobeItems(wardrobeItems.filter(item => item.id !== itemId));
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            top: 'bg-blue-100 text-blue-800',
            bottom: 'bg-green-100 text-green-800',
            shoes: 'bg-purple-100 text-purple-800',
            accessory: 'bg-pink-100 text-pink-800',
            outerwear: 'bg-orange-100 text-orange-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wardrobe</h1>
                    <p className="text-gray-600">Upload photos of your clothing and build your digital wardrobe</p>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-xl p-8 cursor-pointer hover:border-purple-500 transition">
                        <Upload className="w-12 h-12 text-purple-400 mb-3" />
                        <span className="text-lg font-medium text-gray-700 mb-1">
                            {uploading ? 'Analyzing...' : 'Upload Clothing Photo'}
                        </span>
                        <span className="text-sm text-gray-500">
                            We'll automatically identify and categorize your item
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Wardrobe Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        <p className="mt-4 text-gray-600">Loading wardrobe...</p>
                    </div>
                ) : wardrobeItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <p className="text-gray-500 text-lg">Your wardrobe is empty. Upload your first item!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wardrobeItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden group">
                                <div className="relative aspect-square">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                            {item.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{item.color}</p>
                                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                                    {item.ai_tags && item.ai_tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {item.ai_tags.slice(0, 3).map((tag, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA to Outfits */}
                {wardrobeItems.length > 0 && (
                    <div className="mt-12 text-center">
                        <Link
                            href="/outfits"
                            className="inline-block px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
                        >
                            Generate Outfits from My Wardrobe
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}