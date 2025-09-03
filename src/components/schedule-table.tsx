import { TimeInput, TimeInputValue } from "@heroui/date-input";
import { Input } from "@heroui/input";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useRef, useState } from "react";
import { addToast } from "@heroui/toast";
import { MapPinIcon } from "lucide-react";
import { groupBy } from "lodash-es";

import { Schedule, ScheduleTemplate } from "@/data/schedules";

interface ScheduleTableProps {
  item: Schedule;
  data: Schedule[];
  setData: React.Dispatch<React.SetStateAction<Schedule[]>>;
}

export default function ScheduleTable({
  item,
  data,
  setData,
}: ScheduleTableProps) {
  const [newEntry, setNewEntry] = useState({
    index: -1,
    day: -1,
    time: "",
    event: "",
    place: "",
    placeLink: "",
    remarks: "",
  });

  const timeInputRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const placeLinkRef = useRef<HTMLInputElement>(null);
  const remarksRef = useRef<HTMLInputElement>(null);

  function handleEnter(scheduleId: number) {
    const oldSchedule = data.find((s) => s.id === scheduleId)?.schedule;

    if (
      oldSchedule &&
      newEntry.day > 0 &&
      newEntry.time &&
      newEntry.event &&
      newEntry.place
    ) {
      const newSchedules = oldSchedule.map((entry, idx) => {
        if (idx === newEntry.index) {
          return {
            day: newEntry.day,
            time: newEntry.time,
            event: newEntry.event,
            place: newEntry.place,
            placeLink: newEntry.placeLink,
            remarks: newEntry.remarks,
          };
        } else {
          return entry;
        }
      });

      if (newEntry.index === -1) {
        newSchedules.push({
          day: newEntry.day,
          time: newEntry.time,
          event: newEntry.event,
          place: newEntry.place,
          placeLink: newEntry.placeLink,
          remarks: newEntry.remarks,
        });
      }

      const dataByDay = groupBy(newSchedules, "day");

      const sortedData: ScheduleTemplate[] = [];

      for (const day in dataByDay) {
        const entries = dataByDay[day];
        const entriesSorted = entries.sort((a, b) => {
          const todayDate = new Date().toLocaleDateString();

          const aTodayDateTime = todayDate + " " + a.time;
          const aInDateForm = new Date(aTodayDateTime);

          const bTodayDateTime = todayDate + " " + b.time;
          const bInDateForm = new Date(bTodayDateTime);

          return (
            new Date(aInDateForm).getTime() - new Date(bInDateForm).getTime()
          );
        });

        sortedData.push(...entriesSorted);
      }

      setData((prev) => [
        ...prev.filter((s) => s.id !== scheduleId),
        {
          ...prev.find((s) => s.id === scheduleId)!,
          schedule: sortedData,
        },
      ]);

      setNewEntry({
        index: -1,
        day: newEntry.day,
        time: newEntry.time,
        event: "",
        place: "",
        placeLink: "",
        remarks: "",
      });
    } else {
      addToast({
        title: "Invalid entry",
        description: "Please fill in all fields correctly.",
        color: "danger",
      });

      return;
    }
  }

  function timeFormatter(date: TimeInputValue) {
    const str = `${date.hour}:${date.minute} ${date.hour >= 12 ? "PM" : "AM"}`;

    return str;
  }

  return (
    <>
      <div key={item.id} className="mb-2 text-lg flex gap-2">
        {item.title}
        <span className="text-default-500">
          {new Date(item.startDate).toLocaleDateString("en-MY")} to{" "}
          {new Date(item.endDate).toLocaleDateString("en-MY")}
        </span>
      </div>
      <Table key={item.id} className="w-full mb-4">
        <TableHeader>
          <TableColumn>Day</TableColumn>
          <TableColumn>Time</TableColumn>
          <TableColumn>Event</TableColumn>
          <TableColumn>Location</TableColumn>
          <TableColumn>Remarks</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Input
                max={item.numberOfDays}
                min={1}
                step={1}
                type="number"
                value={newEntry.day > 0 ? String(newEntry.day) : ""}
                onChange={(v) =>
                  setNewEntry({
                    ...newEntry,
                    day: Number(v.target.value),
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    timeInputRef.current?.focus();
                  } else if (e.key === "Enter") {
                    handleEnter(item.id);
                  }
                }}
              />
            </TableCell>
            <TableCell>
              <TimeInput
                ref={timeInputRef}
                granularity="minute"
                label="Select Date"
                onChange={(v) =>
                  setNewEntry({
                    ...newEntry,
                    time: v ? timeFormatter(v) : "",
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    e.stopPropagation();
                    eventRef.current?.focus();
                  } else if (e.key === "Enter") {
                    handleEnter(item.id);
                  }
                }}
              />
            </TableCell>
            <TableCell>
              <Input
                ref={eventRef}
                id="event-input"
                value={newEntry.event}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, event: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEnter(item.id);
                  }
                }}
              />
            </TableCell>
            <TableCell>
              <div className="flex gap-1 items-center">
                <Input
                  ref={placeRef}
                  id="place-input"
                  placeholder="Where to?"
                  value={newEntry.place}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, place: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEnter(item.id);
                    }
                  }}
                />

                <Input
                  ref={placeLinkRef}
                  id="place-link-input"
                  placeholder="Link to location"
                  value={newEntry.placeLink}
                  onChange={(e) =>
                    setNewEntry({
                      ...newEntry,
                      placeLink: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEnter(item.id);
                    }
                  }}
                />
              </div>
            </TableCell>
            <TableCell>
              <Input
                ref={remarksRef}
                id="remarks-input"
                placeholder="What should they know?"
                value={newEntry.remarks}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, remarks: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEnter(item.id);
                  }
                }}
              />
            </TableCell>
          </TableRow>

          <>
            {item.schedule.map((item) => (
              <TableRow key={`${item.day}-${item.event}`}>
                <TableCell>{item.day}</TableCell>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.event}</TableCell>
                <TableCell className="flex justify-between">
                  {item.place}
                  {item.placeLink ? (
                    <a
                      href={item.placeLink}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <MapPinIcon size={16} />
                    </a>
                  ) : (
                    <div />
                  )}
                </TableCell>
                <TableCell>{item.remarks}</TableCell>
              </TableRow>
            ))}
          </>
        </TableBody>
      </Table>
    </>
  );
}
