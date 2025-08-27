import { DatePicker } from "@heroui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { useRef, useState } from "react";
import { LinkIcon } from "@heroui/link";

import DefaultLayout from "@/layouts/default";

export default function SchedulePage() {
  const [data, setData] = useState<any[]>([
    {
      date: new Date("2023-03-15").toDateString(),
      event: "Conference",
      place: "New York",
      placeLink: "https://example.com/conference",
      remarks: "Annual tech conference",
    },
    {
      date: new Date("2023-03-16").toDateString(),
      event: "Workshop",
      place: "San Francisco",
      placeLink: "https://example.com/workshop",
      remarks: "Hands-on workshop",
    },
    {
      date: new Date("2023-03-17").toDateString(),
      event: "Keynote",
      place: "Los Angeles",
      remarks: "Opening keynote speech",
    },
  ]);

  const [newEntry, setNewEntry] = useState({
    date: "",
    event: "",
    place: "",
    placeLink: "",
    remarks: "",
  });
  const datePickerRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const placeLinkRef = useRef<HTMLInputElement>(null);
  const remarksRef = useRef<HTMLInputElement>(null);

  function handleEnter() {
    if (newEntry.date && newEntry.event && newEntry.place) {
      setData((prev) =>
        [...prev, newEntry].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
      );
      setNewEntry({
        date: "",
        event: "",
        place: "",
        placeLink: "",
        remarks: "",
      });
    }
  }

  return (
    <DefaultLayout>
      <Table className="w-full">
        <TableHeader>
          <TableColumn>Date</TableColumn>
          <TableColumn>Event</TableColumn>
          <TableColumn>Location</TableColumn>
          <TableColumn>Remarks</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <DatePicker
                ref={datePickerRef}
                granularity="minute"
                label="Select Date"
                onChange={(v) =>
                  setNewEntry({
                    ...newEntry,
                    date: v ? new Date(v).toDateString() : "",
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    e.preventDefault();
                    e.stopPropagation();
                    eventRef.current?.focus();
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
                  if (e.key === "Tab") {
                    e.preventDefault();
                    placeRef.current?.focus();
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
                    if (e.key === "Tab") {
                      e.preventDefault();
                      remarksRef.current?.focus();
                    }
                  }}
                />

                <Input
                  ref={placeLinkRef}
                  id="place-link-input"
                  placeholder="Link to location"
                  value={newEntry.placeLink}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, placeLink: e.target.value })
                  }
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
                    handleEnter();
                  }
                }}
              />
            </TableCell>
          </TableRow>

          <>
            {data.map((item) => (
              <TableRow key={`${item.date}-${item.event}`}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.event}</TableCell>
                <TableCell className="flex justify-between">
                  {item.place}
                  {item.placeLink ? (
                    <a
                      href={item.placeLink}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <LinkIcon />
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
    </DefaultLayout>
  );
}
