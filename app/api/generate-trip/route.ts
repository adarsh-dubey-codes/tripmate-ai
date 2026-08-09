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
            day_number: z.number().int().min(1).describe("The integer day number for this activity. Never a string."),
            title: z.string(),
            description: z.string(),
            activity_type: z.enum([
              "sightseeing",
              "meal",
              "culture",
              "nature",
              "adventure",
              "shopping",
              "relaxation",
              "entertainment",
              "transit",
              "other"
            ]).describe("Must be one of the enum values."),
            start_time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/).describe("HH:mm 24-hour time string only."),
            end_time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/).describe("HH:mm 24-hour time string only."),
            location: z.string(),
            image_url: z.string().optional()
          })
        ).describe(`Exactly ${numDays} days worth of activities. Chronologically ordered within each day.`)
      }),
      prompt: `You are an expert, realistic local travel planner. Generate a highly detailed and geographically sensible ${numDays}-day travel itinerary for ${destination}. 
      Budget level: ${budget}.
      Travel style: ${travel_style}.
      
      RULES:
      - Respect the requested number of days (${numDays}). Assign every activity to the correct day_number (1 to ${numDays}).
      - Create realistic morning, afternoon, and evening pacing.
      - Each day should begin no earlier than 07:00 unless the activity genuinely requires an early start.
      - Do not schedule activities after 22:00 unless appropriate for nightlife/entertainment.
      - Provide real locations, restaurants, and sights that fit the budget and style. Avoid inventing impossible combinations or repeating the same attraction.
      - Keep activities geographically sensible where possible. Leave realistic travel gaps between different locations.
      - Do not make one activity end at exactly the same time another activity begins unless the transition is inherently immediate.
      - Avoid overlapping activities.
      - Avoid scheduling too many major attractions in one day. 
      - Activity quantity per day based on travel style: relaxed (2-3), balanced (3-4), packed (4-5). Meals can be included within those activities.
      - Meal planning: For trips longer than one day, include reasonable meal opportunities using activity_type = "meal". Do not force unnecessary meals if the itinerary already contains an appropriate food experience.
      - Time formatting: start_time and end_time MUST be in 24-hour HH:mm format (e.g., "09:00", "13:30", "18:45"). NEVER use ISO dates.
      - Data types: day_number MUST be an integer, never a string. activity_type MUST be one of the provided enum values. Activities MUST be chronologically ordered within each day.
      - Return high-quality Unsplash image URLs for the main destination and optional activities.`
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
