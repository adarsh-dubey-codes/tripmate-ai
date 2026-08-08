import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { differenceInDays } from 'date-fns';

export const maxDuration = 60; // Allow more time for AI generation

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination, start_date, end_date, budget, travel_style } = body;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    // Calculate number of days (at least 1)
    let numDays = differenceInDays(endDate, startDate) + 1;
    if (numDays < 1) numDays = 1;
    if (numDays > 14) numDays = 14; // Cap at 14 days to avoid huge generations

    const result = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: z.object({
        image_url: z.string().describe("A high-quality Unsplash image URL matching the destination. e.g. https://images.unsplash.com/photo-..."),
    activities: z.array(
  z.object({
    day_number: z.number(),
    title: z.string(),
    description: z.string(),
    activity_type: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    location: z.string(),
    image_url: z.string().optional()
  })
).describe(`Exactly ${numDays} days worth of activities. Usually 3-4 activities per day.`)
      }),
      prompt: `Generate a detailed ${numDays}-day travel itinerary for ${destination}. 
      The trip starts on ${start_date} and ends on ${end_date}.
      Budget level: ${budget}.
      Travel style: ${travel_style}.
      
      For each activity, provide realistic start and end times that fall within the dates specified.
      Provide real locations, restaurants, and sights that fit the budget and style.
      Return high-quality Unsplash image URLs for the main destination and optional activities.`
    });

    return NextResponse.json(result.object);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary. Ensure GOOGLE_GENERATIVE_AI_API_KEY is set." },
      { status: 500 }
    );
  }
}
