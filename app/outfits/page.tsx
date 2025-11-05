'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { ClothingItem } from '@/lib/supabase';

export default function OutfitsPage() {
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [outfit, setOutfit] = useState<ClothingItem[] | null>(null);
    const [explanation, setExplanation] = useState('');
    const [userId, setUserId] = useState<string>('');
    const [wardrobeCount, setWardrobeCount] = useState(0);

    useEffect(() => {
        const tempUserId = localStorage.getItem('tempUserId') || crypto.randomUUID();
        localStorage.setItem('tempUserId', tempUserId);
        setUserId(tempUserId);
        checkWardrobe(tempUserId);
    }, []);

    const checkWardrobe = async (uid: string) => {
        try {
            const response = await fetch(`/api/wardrobe?userId=${uid}`);
            const data = await response.json();
            if (data.success) {
                setWardrobeCount(data.data?.length || 0);
            }
        } catch (error) {
            console.error('Error checking wardrobe:', error);
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || generating) return;

        setGenerating(true);
        setOutfit(null);
        setExplanation('');

        try {
            const response = await fetch('/api/generate-outfit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    userId,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setOutfit(result.outfit);
                setExplanation(result.explanation);
            } else {
                alert('Failed to generate outfit: ' + result.error);
            }
        } catch (error) {
            console.error('Error generating outfit:', error);
            alert('Failed to generate outfit. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const quickPrompts = [
        'Casual weekend brunch outfit',
        'Professional office meeting',
        'Date night at a nice restaurant',
        'Cold winter day with a scarf',
        'Gym workout session',
        'Beach day outfit',
    ];

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

    if (wardrobeCount === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="container mx-auto px-4 py-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>

                    <div className="max-w-2xl mx-auto mt-20">
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-8 h-8 text-purple-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Build Your Wardrobe First
                            </h2>
                            <p className="text-gray-600 mb-8">
                                You need to add clothing items to your wardrobe before generating outfits.
                                Upload photos of your clothes and we'll organize them for you!
                            </p>
                            <Link
                                href="/wardrobe"
                                className="inline-block px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
                            >
                                Go to Wardrobe
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Generate Outfits</h1>
                    <p className="text-gray-600">
                        Describe what you need and Atelier will create the perfect outfit from your wardrobe
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <form onSubmit={handleGenerate}>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            What kind of outfit are you looking for?
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="E.g., 'Cold winter day outfit with a scarf'"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                disabled={generating}
                            />
                            <button
                                type="submit"
                                disabled={generating || !prompt.trim()}
                                className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {generating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Quick Prompts */}
                    <div className="mt-6">
                        <p className="text-sm text-gray-600 mb-3">Quick ideas:</p>
                        <div className="flex flex-wrap gap-2">
                            {quickPrompts.map((quickPrompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setPrompt(quickPrompt)}
                                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition"
                                    disabled={generating}
                                >
                                    {quickPrompt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Generated Outfit Display */}
                {outfit && outfit.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Outfit</h2>
                            {explanation && (
                                <p className="text-gray-600 bg-purple-50 p-4 rounded-xl">
                                    {explanation}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {outfit.map((item) => (
                                <div key={item.id} className="bg-gray-50 rounded-xl overflow-hidden">
                                    <div className="relative aspect-square">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                                {item.category}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">{item.color}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => {
                                    setOutfit(null);
                                    setExplanation('');
                                    setPrompt('');
                                }}
                                className="px-6 py-3 bg-purple-100 text-purple-700 rounded-xl font-semibold hover:bg-purple-200 transition"
                            >
                                Generate Another Outfit
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!outfit && !generating && (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">
                            Enter a prompt above to generate your first outfit!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}