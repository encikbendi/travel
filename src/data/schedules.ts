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
  startDate: string;
  endDate: string;
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
];
