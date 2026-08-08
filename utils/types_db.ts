export type Trip = {
  id: string;
  user_id: string;
  destination: string;
  days: number;
  budget: number;
  travelers: number | string;
  interests: string;
  itinerary: any | null; // JSON
  created_at: string;
};

export type Activity = {
  id: string;
  trip_id: string;
  day_number: number;
  activity_type: string;
  title: string;
  description: string | null;
  start_time: string; // ISO timestamp
  end_time: string | null;
  location: string | null;
  image_url: string | null;
  created_at: string;
};
