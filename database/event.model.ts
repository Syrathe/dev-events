import { Document, model, models, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const REQUIRED_TEXT_FIELDS = [
  "title",
  "description",
  "overview",
  "image",
  "venue",
  "location",
  "mode",
  "audience",
  "organizer",
] as const;

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    overview: { type: String, required: true, trim: true, maxlength: 500 },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: {
      type: String,
      required: true,
      enum: ["online", "offline", "hybrid"],
    },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "At least one agenda item is required",
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "At least one tag is required",
      },
    },
  },
  { timestamps: true }
);

EventSchema.pre("save", function validateAndNormalizeEvent() {
  for (const field of REQUIRED_TEXT_FIELDS) {
    const value = this[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`${field} is required`);
    }
    this[field] = value.trim() as IEvent[typeof field];
  }

  if (!Array.isArray(this.agenda) || this.agenda.length === 0) {
    throw new Error("agenda is required");
  }
  if (!Array.isArray(this.tags) || this.tags.length === 0) {
    throw new Error("tags is required");
  }

  // Slug is regenerated only when the title changes.
  if (this.isNew || this.isModified("title")) {
    this.slug = generateSlug(this.title);
  }

  // Date is normalized to ISO calendar format (YYYY-MM-DD).
  this.date = normalizeDate(this.date);

  // Time is normalized to 24h HH:mm for consistent storage.
  this.time = normalizeTime(this.time);
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeDate(dateInput: string): string {
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("date must be a valid date");
  }
  return parsed.toISOString().split("T")[0];
}

function normalizeTime(timeInput: string): string {
  const match = timeInput.trim().match(/^(\d{1,2}):(\d{2})(?:\s?(AM|PM))?$/i);
  if (!match) {
    throw new Error("time must be in HH:mm or HH:mm AM/PM format");
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error("time contains invalid hour or minute values");
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

EventSchema.index({ slug: 1 }, { unique: true });

const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;
