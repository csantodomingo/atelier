import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch user's wardrobe
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('clothing_items')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch wardrobe' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching wardrobe:', error);
        return NextResponse.json(
            { error: 'Failed to fetch wardrobe' },
            { status: 500 }
        );
    }
}

// DELETE - Remove item from wardrobe
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get('itemId');
        const userId = searchParams.get('userId');

        if (!itemId || !userId) {
            return NextResponse.json(
                { error: 'Missing itemId or userId' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('clothing_items')
            .delete()
            .eq('id', itemId)
            .eq('user_id', userId);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to delete item' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting item:', error);
        return NextResponse.json(
            { error: 'Failed to delete item' },
            { status: 500 }
        );
    }
}