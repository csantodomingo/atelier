import { NextRequest, NextResponse } from 'next/server';
import { analyzeClothingImage } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { imageUrl, userId } = await request.json();

        if (!imageUrl || !userId) {
            return NextResponse.json(
                { error: 'Missing imageUrl or userId' },
                { status: 400 }
            );
        }

        // Analyze the image with OpenAI
        const analysis = await analyzeClothingImage(imageUrl);

        // Save to Supabase
        const { data, error } = await supabase
            .from('clothing_items')
            .insert({
                user_id: userId,
                name: analysis.name,
                category: analysis.category,
                color: analysis.color,
                description: analysis.description,
                image_url: imageUrl,
                ai_tags: analysis.tags,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to save clothing item' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error analyzing clothing:', error);
        return NextResponse.json(
            { error: 'Failed to analyze clothing' },
            { status: 500 }
        );
    }
}