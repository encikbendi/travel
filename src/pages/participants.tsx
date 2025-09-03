import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { addToast } from "@heroui/toast";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";

import DefaultLayout from "@/layouts/default";
import { schedulesData } from "@/data/schedules";

interface Trip {
  id: number;
  scheduleId: number;
  title: string;
  startDate: number;
  endDate: number;
  place: string;
}

interface Participant {
  id: number;
  name: string;
  phoneNumber: string;
  trips: Trip[];
}

// Sample participant data
const sampleParticipants: Participant[] = [
  {
    id: 1,
    name: "John Doe",
    phoneNumber: "+1-555-0123",
    trips: [
      {
        id: 1,
        scheduleId: 1,
        title: "Tech Conference Tour",
        startDate: new Date("2025-09-01").getTime(),
        endDate: new Date("2025-09-03").getTime(),
        place: "USA",
      },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    phoneNumber: "+1-555-0456",
    trips: [
      {
        id: 2,
        scheduleId: 1,
        title: "Tech Conference Tour",
        startDate: new Date("2025-09-01").getTime(),
        endDate: new Date("2025-09-03").getTime(),
        place: "USA",
      },
    ],
  },
];

export default function ParticipantsPage() {
  const [participants, setParticipants] =
    useState<Participant[]>(sampleParticipants);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    phoneNumber: "",
  });
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    number | null
  >(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isAddTripOpen,
    onOpen: onAddTripOpen,
    onOpenChange: onAddTripOpenChange,
    onClose: onAddTripClose,
  } = useDisclosure();

  function addParticipant() {
    if (!newParticipant.name || !newParticipant.phoneNumber) {
      addToast({
        title: "Invalid participant",
        description: "Please fill in all fields.",
        color: "danger",
      });

      return;
    }

    const participant: Participant = {
      id: Date.now(),
      name: newParticipant.name,
      phoneNumber: newParticipant.phoneNumber,
      trips: [],
    };

    setParticipants((prev) => [...prev, participant]);
    setNewParticipant({ name: "", phoneNumber: "" });
    onClose();

    addToast({
      title: "Participant added",
      description: `${participant.name} has been added successfully.`,
      color: "success",
    });
  }

  function addTripToParticipant() {
    if (!selectedScheduleId || selectedParticipantId === null) {
      addToast({
        title: "Invalid selection",
        description: "Please select a participant and schedule.",
        color: "danger",
      });

      return;
    }

    const schedule = schedulesData.find(
      (s) => s.id === parseInt(selectedScheduleId),
    );

    if (!schedule) return;

    const trip: Trip = {
      id: Date.now(),
      scheduleId: schedule.id,
      title: schedule.title,
      startDate:
        typeof schedule.startDate === "string"
          ? new Date(schedule.startDate).getTime()
          : typeof schedule.startDate === "number"
            ? schedule.startDate
            : schedule.startDate.getTime(),
      endDate:
        typeof schedule.endDate === "string"
          ? new Date(schedule.endDate).getTime()
          : typeof schedule.endDate === "number"
            ? schedule.endDate
            : schedule.endDate.getTime(),
      place: schedule.place,
    };

    setParticipants((prev) =>
      prev.map((participant) =>
        participant.id === selectedParticipantId
          ? {
              ...participant,
              trips: [...participant.trips, trip].sort(
                (a, b) => a.startDate - b.startDate,
              ),
            }
          : participant,
      ),
    );

    setSelectedScheduleId("");
    setSelectedParticipantId(null);
    onAddTripClose();

    addToast({
      title: "Trip added",
      description: "Trip has been added successfully.",
      color: "success",
    });
  }

  function openAddTripModal(participantId: number) {
    setSelectedParticipantId(participantId);
    onAddTripOpen();
  }

  function getSelectedScheduleTitle() {
    if (!selectedScheduleId) return "Select a schedule";
    const schedule = schedulesData.find(
      (s) => s.id === parseInt(selectedScheduleId),
    );

    return schedule ? schedule.title : "Select a schedule";
  }

  return (
    <DefaultLayout>
      <div className="mb-4 justify-between items-end flex">
        <h1 className="mb-2 text-2xl font-bold">Participants</h1>
        <Button variant="bordered" onPress={onOpen}>
          + New Participant
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Add New Participant</ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              placeholder="Enter participant's name"
              value={newParticipant.name}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, name: e.target.value })
              }
            />
            <Input
              label="Phone Number"
              placeholder="Enter phone number"
              value={newParticipant.phoneNumber}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  phoneNumber: e.target.value,
                })
              }
            />
            <Input
              label="IC / Passport Number"
              placeholder="Enter IC / Passport Number"
            />
            <div className="flex gap-2 pt-4">
              <Button color="primary" onPress={addParticipant}>
                Add Participant
              </Button>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isAddTripOpen} onOpenChange={onAddTripOpenChange}>
        <ModalContent>
          <ModalHeader>Add Trip to Participant</ModalHeader>
          <ModalBody>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">{getSelectedScheduleTitle()}</Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => setSelectedScheduleId(key as string)}
              >
                {schedulesData.map((schedule) => (
                  <DropdownItem key={schedule.id.toString()}>
                    {schedule.title} (
                    {new Date(schedule.startDate).toLocaleDateString("en-MY")} -{" "}
                    {new Date(schedule.endDate).toLocaleDateString("en-MY")})
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <div className="flex gap-2 pt-4">
              <Button color="primary" onPress={addTripToParticipant}>
                Add Trip
              </Button>
              <Button variant="flat" onPress={onAddTripClose}>
                Cancel
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Table className="w-full">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Phone Number</TableColumn>
          <TableColumn>Trip Title</TableColumn>
          <TableColumn>Trip Dates</TableColumn>
          <TableColumn>Place</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {participants.flatMap((participant) =>
            participant.trips.length > 0
              ? participant.trips.map((trip) => (
                  <TableRow key={`${participant.id}-${trip.id}`}>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.phoneNumber}</TableCell>
                    <TableCell>
                      <span className="font-medium">{trip.title}</span>
                    </TableCell>
                    <TableCell className="text-default-500">
                      {new Date(trip.startDate).toLocaleDateString("en-MY")} -{" "}
                      {new Date(trip.endDate).toLocaleDateString("en-MY")}
                    </TableCell>
                    <TableCell className="text-default-400">
                      {trip.place}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => openAddTripModal(participant.id)}
                      >
                        Add Trip
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : [
                  <TableRow key={`${participant.id}-no-trips`}>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.phoneNumber}</TableCell>
                    <TableCell colSpan={3}>
                      <span className="text-default-400 text-sm">
                        No trips assigned
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => openAddTripModal(participant.id)}
                      >
                        Add Trip
                      </Button>
                    </TableCell>
                  </TableRow>,
                ],
          )}
        </TableBody>
      </Table>
    </DefaultLayout>
  );
}
