import { NextRequest, NextResponse } from 'next/server';
import { generateOutfit } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { prompt, userId } = await request.json();

        if (!prompt || !userId) {
            return NextResponse.json(
                { error: 'Missing prompt or userId' },
                { status: 400 }
            );
        }

        // Get user's wardrobe
        const { data: clothingItems, error: fetchError } = await supabase
            .from('clothing_items')
            .select('*')
            .eq('user_id', userId);

        if (fetchError || !clothingItems || clothingItems.length === 0) {
            return NextResponse.json(
                { error: 'No clothing items found in wardrobe' },
                { status: 404 }
            );
        }

        // Generate outfit with OpenAI
        const result = await generateOutfit(prompt, clothingItems);

        // Get full details of selected items
        const selectedItems = clothingItems.filter(item =>
            result.outfit.includes(item.id)
        );

        // Optionally save outfit to database
        const { data: outfitData, error: saveError } = await supabase
            .from('outfits')
            .insert({
                user_id: userId,
                prompt,
                clothing_item_ids: result.outfit,
                image_urls: selectedItems.map(item => item.image_url),
            })
            .select()
            .single();

        if (saveError) {
            console.error('Error saving outfit:', saveError);
        }

        return NextResponse.json({
            success: true,
            outfit: selectedItems,
            explanation: result.explanation,
            outfitId: outfitData?.id,
        });
    } catch (error) {
        console.error('Error generating outfit:', error);
        return NextResponse.json(
            { error: 'Failed to generate outfit' },
            { status: 500 }
        );
    }
}