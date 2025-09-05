import { Package } from "./packages";

export interface ScheduleTemplate {
  day: number;
  event: string;
  place: string;
  placeLink?: string;
  remarks?: string;
  time: string;
}

export interface Schedule extends Omit<Package, "template"> {
  packageId?: number;
  startDate: Date | number | string;
  endDate: Date | number | string;
  schedule: ScheduleTemplate[];
}

export const schedulesData: Schedule[] = [
  {
    id: 1,
    packageId: 1,
    title: "Tech Conference Tour",
    description: "A tour package for attending tech conferences",
    price: 2500,
    place: "USA",
    numberOfDays: 3,
    startDate: "2025/09/01",
    endDate: "2025/09/03",
    schedule: [
      {
        day: 1,
        time: "10:00 AM",
        event: "Conference",
        place: "New York",
        placeLink: "https://example.com/conference",
        remarks: "Annual tech conference",
      },
      {
        day: 1,
        time: "12:00 PM",
        event: "Networking Lunch",
        place: "New York",
        remarks: "Lunch with industry leaders",
      },
      {
        day: 2,
        time: "11:00 AM",
        event: "Workshop",
        place: "San Francisco",
        placeLink: "https://example.com/workshop",
        remarks: "Hands-on workshop",
      },
      {
        day: 3,
        time: "12:00 PM",
        event: "Keynote",
        place: "Los Angeles",
        remarks: "Opening keynote speech",
      },
    ],
  },
  {
    id: 2,
    packageId: 1,
    title: "Business Summit",
    description: "A summit for business leaders and entrepreneurs.",
    price: 3000,
    place: "Canada",
    numberOfDays: 2,
    startDate: "2025/09/05",
    endDate: "2025/09/06",
    schedule: [
      {
        day: 1,
        time: "09:00 AM",
        event: "Opening Ceremony",
        place: "Toronto",
        remarks:
          "Inaugural session with keynote speakers.  Long remarks to show the layout effect when there are multiple lines of text",
      },
      {
        day: 2,
        time: "10:00 AM",
        event: "Networking Session",
        place: "Vancouver",
        remarks: "Connect with industry leaders",
      },
    ],
  },
  {
    id: 3,
    packageId: 1,
    title: "Innovation Expo",
    description: "An expo showcasing the latest in tech innovation",
    price: 3500,
    place: "UK",
    numberOfDays: 2,
    startDate: "2025/09/10",
    endDate: "2025/09/11",
    schedule: [
      {
        day: 1,
        time: "10:00 AM",
        event: "Expo Opening",
        place: "London",
        remarks: "Kick-off event for the expo",
      },
      {
        day: 2,
        time: "11:00 AM",
        event: "Panel Discussion",
        place: "Birmingham",
        remarks: "Discussion on future tech trends",
      },
      {
        day: 3,
        time: "12:00 PM",
        event: "Closing Ceremony",
        place: "Manchester",
        remarks: "Wrap-up session for the expo",
      },
    ],
  },
];
