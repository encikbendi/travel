import { DatePicker } from "@heroui/date-picker";
import { useState } from "react";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { Accordion, AccordionItem } from "@heroui/accordion";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Link } from "@heroui/link";

import DefaultLayout from "@/layouts/default";
import { Schedule, schedulesData } from "@/data/schedules";
import { Package, packagesData } from "@/data/packages";
import ScheduleTable from "@/components/schedule-table";

export default function SchedulePage() {
  const [data, setData] = useState<Schedule[]>(schedulesData);
  const [newTemplateStart, setNewTemplateStart] = useState<Date | null>(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  function addTemplate(pkg: Package) {
    if (newTemplateStart === null) {
      return addToast({
        title: "Invalid date range",
        description: "Please select a valid start and end date.",
        color: "danger",
      });
    }

    const dateRange: {
      startDate: Date;
      endDate: Date;
    } = {
      startDate: new Date(newTemplateStart),
      endDate: new Date(
        new Date(newTemplateStart).getTime() +
          pkg.numberOfDays * 24 * 60 * 60 * 1000,
      ),
    };

    setData((prev) => [
      ...prev,
      {
        id: Date.now(),
        packageId: pkg.id,
        title: pkg.title,
        description: pkg.description,
        price: pkg.price,
        place: pkg.place,
        numberOfDays: pkg.numberOfDays,
        startDate: dateRange.startDate.getTime(),
        endDate: dateRange.endDate.getTime(),
        schedule: pkg.template,
      },
    ]);

    onClose();
  }

  return (
    <DefaultLayout>
      <div className="mb-4 justify-between items-end flex">
        <h1 className="mb-2 text-2xl font-bold">Schedules</h1>
        <Button variant="bordered" onPress={onOpen}>
          + New
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Select Package</ModalHeader>
          <ModalBody>
            <DatePicker
              granularity="day"
              label="Start Date"
              onChange={(v) => setNewTemplateStart(v)}
            />
            {packagesData.map((pkg) => (
              <Button
                key={pkg.id}
                className="mb-2"
                variant="flat"
                onPress={() => addTemplate(pkg)}
              >
                {pkg.title} ({pkg.numberOfDays} days)
              </Button>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Accordion variant="splitted">
        {data
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          )
          .map((item) => (
            <AccordionItem
              key={item.id}
              subtitle={`${new Date(item.startDate).toLocaleDateString("en-MY")} to ${new Date(item.endDate).toLocaleDateString("en-MY")}`}
              title={item.title}
            >
              <ScheduleTable
                key={item.id}
                data={data}
                item={item}
                setData={setData}
              />
              <div className="flex justify-end mb-4">
                <Link href={`/schedules/${item.id}/participants`}>
                  <Button variant="flat" onPress={() => {}}>
                    Manage Participants
                  </Button>
                </Link>
              </div>
            </AccordionItem>
          ))}
      </Accordion>
    </DefaultLayout>
  );
}
