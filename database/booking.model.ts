import { Document, model, models, Schema, Types } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => EMAIL_REGEX.test(value),
        message: "email must be a valid email address",
      },
    },
  },
  { timestamps: true }
);

BookingSchema.pre("save", async function validateBookingReferences() {
  // Normalize and validate email before persistence.
  this.email = this.email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(this.email)) {
    throw new Error("email must be a valid email address");
  }

  if (!Types.ObjectId.isValid(this.eventId)) {
    throw new Error("eventId must be a valid ObjectId");
  }

  // Ensure the referenced event exists before creating/updating a booking.
  if (this.isNew || this.isModified("eventId")) {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error("eventId does not reference an existing Event");
    }
  }
});

BookingSchema.index({ eventId: 1 });

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
