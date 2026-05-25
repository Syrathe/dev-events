export type EventItem = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};
export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "Next.js Conf 2024",
    slug: "nextjs-conf-2024",
    location: "San Francisco, CA",
    date: "October 24, 2024",
    time: "9:00 AM",
  },
  {
    image: "/images/event2.png",
    title: "React Summit",
    slug: "react-summit",
    location: "Amsterdam, Netherlands",
    date: "June 14, 2024",
    time: "10:00 AM",
  },
  {
    image: "/images/event3.png",
    title: "Web Summit 2024",
    slug: "web-summit-2024",
    location: "Lisbon, Portugal",
    date: "November 11, 2024",
    time: "9:00 AM",
  },
  {
    image: "/images/event4.png",
    title: "JSWorld Conference",
    slug: "jsworld-conference",
    location: "Online",
    date: "February 28, 2024",
    time: "1:00 PM",
  },
  {
    image: "/images/event5.png",
    title: "AWS re:Invent",
    slug: "aws-reinvent",
    location: "Las Vegas, NV",
    date: "December 2, 2024",
    time: "8:00 AM",
  },
  {
    image: "/images/event6.png",
    title: "Devoxx Belgium",
    slug: "devoxx-belgium",
    location: "Antwerp, Belgium",
    date: "October 7, 2024",
    time: "9:30 AM",
  },
];
