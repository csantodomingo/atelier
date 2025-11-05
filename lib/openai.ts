import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Analyze clothing from image
export async function analyzeClothingImage(imageUrl: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Analyze this clothing item and provide the following information in JSON format:
            {
              "name": "brief name of the item",
              "category": "top/bottom/shoes/accessory/outerwear",
              "color": "primary color",
              "description": "detailed description including style, pattern, material",
              "tags": ["array", "of", "relevant", "tags"]
            }`
                    },
                    {
                        type: "image_url",
                        image_url: { url: imageUrl }
                    }
                ]
            }
        ],
        max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No response from OpenAI');

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');

    return JSON.parse(jsonMatch[0]);
}

// Generate outfit based on prompt and available clothing
export async function generateOutfit(
    prompt: string,
    availableClothing: Array<{ id: string; name: string; category: string; color: string; description: string }>
) {
    const clothingList = availableClothing
        .map(item => `ID: ${item.id} - ${item.category}: ${item.name} (${item.color}) - ${item.description}`)
        .join('\n');

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are a fashion stylist. Create outfits from the user's wardrobe that match their request."
            },
            {
                role: "user",
                content: `Create an outfit for: "${prompt}"

Available clothing items:
${clothingList}

Respond with ONLY a JSON object in this format:
{
  "outfit": ["item_id_1", "item_id_2", "item_id_3"],
  "explanation": "brief explanation of why this outfit works"
}

Select 3-5 items that work well together.`
            }
        ],
        max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No response from OpenAI');

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');

    return JSON.parse(jsonMatch[0]);
}