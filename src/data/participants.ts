import { Schedule } from "./schedules";

export interface Participant {
  id: number;
  name: string;
  phone: string;
  schedules: Schedule[];
  documentId: string;
}

export interface ParticipantRoom {
  participantId: number;
  roomNo: string;
}

export interface ScheduleParticipant {
  scheduleId: number;
  participantRooms: ParticipantRoom[];
}

export const participantsData: Participant[] = [
  {
    id: 1,
    name: "Muhammad Ali",
    phone: "123-456-7890",
    schedules: [],
    documentId: "doc-1",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    phone: "123-456-7891",
    documentId: "doc-2",
    schedules: [],
  },
  {
    id: 3,
    name: "Ahmad Zainuddin",
    phone: "123-456-7892",
    schedules: [],
    documentId: "doc-3",
  },
  {
    id: 4,
    name: "Fatimah Abdullah",
    phone: "123-456-7893",
    schedules: [],
    documentId: "doc-4",
  },
  {
    id: 5,
    name: "Mohd Razak",
    phone: "123-456-7894",
    schedules: [],
    documentId: "doc-5",
  },
  {
    id: 6,
    name: "Aminah Hassan",
    phone: "123-456-7895",
    schedules: [],
    documentId: "doc-6",
  },
  {
    id: 7,
    name: "Ibrahim Sulaiman",
    phone: "123-456-7896",
    schedules: [],
    documentId: "doc-7",
  },
  {
    id: 8,
    name: "Khadijah Omar",
    phone: "123-456-7897",
    schedules: [],
    documentId: "doc-8",
  },
  {
    id: 9,
    name: "Ismail Rahman",
    phone: "123-456-7898",
    documentId: "doc-9",
    schedules: [],
  },
  {
    id: 10,
    name: "Zainab Yusof",
    phone: "123-456-7899",
    schedules: [],
    documentId: "doc-10",
  },
];

export const scheduleParticipantsData: ScheduleParticipant[] = [
  {
    scheduleId: 1,
    participantRooms: [
      { participantId: 1, roomNo: "101" },
      { participantId: 2, roomNo: "102" },
      { participantId: 3, roomNo: "103" },
    ],
  },
  {
    scheduleId: 2,
    participantRooms: [
      { participantId: 4, roomNo: "201" },
      { participantId: 5, roomNo: "202" },
      { participantId: 6, roomNo: "203" },
      { participantId: 7, roomNo: "204" },
    ],
  },
  {
    scheduleId: 3,
    participantRooms: [
      { participantId: 8, roomNo: "301" },
      { participantId: 9, roomNo: "302" },
      { participantId: 10, roomNo: "303" },
    ],
  },
];
