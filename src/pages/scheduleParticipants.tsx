import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { addToast } from "@heroui/toast";

import DefaultLayout from "@/layouts/default";
import { schedulesData } from "@/data/schedules";
import {
  participantsData,
  scheduleParticipantsData,
  type ScheduleParticipant,
} from "@/data/participants";

export default function ScheduleParticipantsPage() {
  const { id } = useParams<{ id: string }>();

  const { inputRef } = useRef<HTMLInputElement>(null);

  const schedule = schedulesData.find((s) => s.id === Number(id));

  const [scheduleParticipants, setScheduleParticipants] = useState<
    ScheduleParticipant[]
  >(scheduleParticipantsData);
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    string | null
  >(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
  const [editingRoomValue, setEditingRoomValue] = useState<string>("");

  const scheduleParticipantData = scheduleParticipants.find(
    (sp) => sp.scheduleId === Number(id),
  );

  const participantRooms = scheduleParticipantData?.participantRooms || [];

  const participantDetails = participantsData
    .filter((p) => participantRooms.some((pr) => pr.participantId === p.id))
    .map((participant) => {
      const room = participantRooms.find(
        (pr) => pr.participantId === participant.id,
      );

      return {
        ...participant,
        roomNo: room?.roomNo || "",
      };
    })
    .sort((a, b) => {
      // Sort by room number, with empty rooms at the end
      if (!a.roomNo && !b.roomNo) return 0;
      if (!a.roomNo) return 1;
      if (!b.roomNo) return -1;

      return a.roomNo.localeCompare(b.roomNo, undefined, { numeric: true });
    });

  // Calculate room types based on occupancy
  const getRoomType = (roomNo: string): string => {
    if (!roomNo) return "-";

    const occupancy = participantRooms.filter(
      (pr) => pr.roomNo === roomNo,
    ).length;

    switch (occupancy) {
      case 1:
        return "Single";
      case 2:
        return "Double";
      case 3:
        return "Triple";
      case 4:
        return "Quad";
      default:
        return `${occupancy} people`;
    }
  };

  // Get participants that are not already in this schedule
  const availableParticipants = participantsData.filter(
    (p) => !participantRooms.some((pr) => pr.participantId === p.id),
  );

  // Filter participants based on search (name and phone)
  const filteredParticipants = availableParticipants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      participant.phone.toLowerCase().includes(searchValue.toLowerCase()) ||
      participant.documentId.toLowerCase().includes(searchValue.toLowerCase()),
  );

  function removeParticipant(participantId: number) {
    setScheduleParticipants((prev) =>
      prev.map((sp) =>
        sp.scheduleId === Number(id)
          ? {
              ...sp,
              participantRooms: sp.participantRooms.filter(
                (pr) => pr.participantId !== participantId,
              ),
            }
          : sp,
      ),
    );

    const participant = participantsData.find((p) => p.id === participantId);

    addToast({
      title: "Participant removed",
      description: `${participant?.name} has been removed from this schedule.`,
      color: "success",
    });
  }

  function addParticipant() {
    if (!selectedParticipantId) {
      addToast({
        title: "Invalid selection",
        description: "Please select a participant to add.",
        color: "danger",
      });

      return;
    }

    const participantId = parseInt(selectedParticipantId);

    setScheduleParticipants((prev) => {
      const existingSchedule = prev.find((sp) => sp.scheduleId === Number(id));

      if (existingSchedule) {
        return prev.map((sp) =>
          sp.scheduleId === Number(id)
            ? {
                ...sp,
                participantRooms: [
                  ...sp.participantRooms,
                  { participantId, roomNo: "" },
                ],
              }
            : sp,
        );
      } else {
        return [
          ...prev,
          {
            scheduleId: Number(id),
            participantRooms: [{ participantId, roomNo: "" }],
          },
        ];
      }
    });

    const participant = participantsData.find((p) => p.id === participantId);

    setSelectedParticipantId(null);
    setSearchValue("");

    addToast({
      title: "Participant added",
      description: `${participant?.name} has been added to this schedule.`,
      color: "success",
    });
  }

  function startEditingRoom(participantId: number, currentRoomNo: string) {
    setEditingRoomId(participantId);
    setEditingRoomValue(currentRoomNo);
  }

  function saveRoomEdit(participantId: number) {
    setScheduleParticipants((prev) =>
      prev.map((sp) =>
        sp.scheduleId === Number(id)
          ? {
              ...sp,
              participantRooms: sp.participantRooms
                .map((pr) =>
                  pr.participantId === participantId
                    ? { ...pr, roomNo: editingRoomValue }
                    : pr,
                )
                .sort((a, b) => {
                  return a.roomNo.localeCompare(b.roomNo);
                }),
            }
          : sp,
      ),
    );

    setEditingRoomId(null);
    setEditingRoomValue("");

    const participant = participantsData.find((p) => p.id === participantId);

    addToast({
      title: "Room updated",
      description: `Room number for ${participant?.name} has been updated.`,
      color: "success",
    });
  }

  function cancelEditingRoom() {
    setEditingRoomId(null);
    setEditingRoomValue("");
  }

  return (
    <DefaultLayout>
      <h1 className="mb-2 text-2xl font-bold">Manage Participants</h1>
      <div className="flex gap-2 items-center mb-6">
        <h2 className="text-xl text-default-600">{schedule?.title}</h2>
        <span className="text-lg text-default-500">
          ({new Date(schedule?.startDate || "").toLocaleDateString()} -{" "}
          {new Date(schedule?.endDate || "").toLocaleDateString()})
        </span>
      </div>

      <Table className="w-full mb-6">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Phone</TableColumn>
          <TableColumn>Document ID</TableColumn>
          <TableColumn>Room Type</TableColumn>
          <TableColumn className="w-32">Room Number</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {participantDetails.length > 0 ? (
            participantDetails.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>{participant.name}</TableCell>
                <TableCell>{participant.phone}</TableCell>
                <TableCell>{participant.documentId}</TableCell>
                <TableCell>{getRoomType(participant.roomNo)}</TableCell>
                <TableCell>
                  {editingRoomId === participant.id ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        ref={inputRef}
                        size="sm"
                        value={editingRoomValue}
                        onChange={(e) => setEditingRoomValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveRoomEdit(participant.id);
                          } else if (e.key === "Escape") {
                            cancelEditingRoom();
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <span>{participant.roomNo || "Not assigned"}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingRoomId === participant.id ? (
                    <div className="flex gap-2">
                      <Button
                        color="success"
                        size="sm"
                        onPress={() => saveRoomEdit(participant.id)}
                      >
                        Save
                      </Button>
                      <Button
                        color="default"
                        size="sm"
                        variant="light"
                        onPress={cancelEditingRoom}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => {
                          startEditingRoom(participant.id, participant.roomNo);
                        }}
                      >
                        Edit Room
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        variant="flat"
                        onPress={() => removeParticipant(participant.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <span className="text-default-400 text-sm">
                  No participants assigned to this schedule
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex gap-2 items-center">
        <Autocomplete
          className="min-w-[200px]"
          inputValue={searchValue}
          items={filteredParticipants}
          placeholder="Search participants..."
          selectedKey={selectedParticipantId}
          onInputChange={(value) => setSearchValue(value)}
          onSelectionChange={(key) => {
            setSelectedParticipantId(key as string);
            // Set the search value to the selected participant's display text
            if (key) {
              const selectedParticipant = participantsData.find(
                (p) => p.id === parseInt(key as string),
              );

              if (selectedParticipant) {
                setSearchValue(
                  `${selectedParticipant.name} - ${selectedParticipant.phone} - ${selectedParticipant.documentId}`,
                );
              }
            }
          }}
        >
          {(participant) => (
            <AutocompleteItem key={participant.id}>
              {participant.name} - {participant.phone} -{" "}
              {participant.documentId}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Button
          color="primary"
          isDisabled={!selectedParticipantId}
          onPress={addParticipant}
        >
          + Add
        </Button>
      </div>
    </DefaultLayout>
  );
}
