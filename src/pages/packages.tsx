import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Pencil, PlusCircle } from "lucide-react";
import { Button } from "@heroui/button";
import { useState } from "react";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { groupBy, isEmpty } from "lodash-es";
import { LinkIcon } from "@heroui/link";
import { TimeInput } from "@heroui/date-input";

import DefaultLayout from "@/layouts/default";
import { Package, packagesData } from "@/data/packages";

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>(packagesData);

  const [newPackage, setNewPackage] = useState<Package>({
    id: -1,
    title: "",
    description: "",
    price: 0,
    place: "",
    numberOfDays: 0,
    template: [],
  });

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<
    number | null
  >(null);

  const [selectedTemplate, setSelectedTemplate] = useState<
    Package["template"][number] | null
  >(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function handleSubmit() {
    if (!newPackage) return;

    const toSubmit: Package = { ...newPackage };

    if (toSubmit.id === -1) {
      const lastId = packages.sort((a, b) => b.id - a.id)[0]?.id || 0;

      toSubmit.id = lastId + 1;

      toSubmit.template = Array.from({
        length: toSubmit.numberOfDays || 0,
      }).map((_, index) => ({
        day: index + 1,
        event: "",
        place: "",
        placeLink: "",
        remarks: "",
        time: "",
      }));
    }

    if (
      !toSubmit.title ||
      !toSubmit.description ||
      !toSubmit.price ||
      !toSubmit.place ||
      !toSubmit.numberOfDays
    ) {
      addToast({
        title: "Incomplete fields",
        description: "Please fill in all fields before submitting.",
        color: "warning",
      });

      return;
    }

    if (newPackage.id === -1) {
      setPackages([...packages, toSubmit]);
    } else {
      setPackages(packages.map((p) => (p.id === toSubmit.id ? toSubmit : p)));
    }

    selectPackage(-1);
  }

  function selectPackage(id: number) {
    let pkg: Package | undefined;

    if (id === -1) {
      pkg = {
        id: -1,
        title: "",
        description: "",
        price: 0,
        place: "",
        numberOfDays: 0,
        template: [],
      };
    } else {
      pkg = packages.find((p) => p.id === id);
    }

    if (!pkg) {
      addToast({
        title: "Package not found",
        description: "The selected package could not be found. Please refresh",
        color: "danger",
      });

      return;
    }

    setSelectedPackage({ ...pkg });
    setNewPackage({ ...pkg });
  }

  const templateByDays = groupBy(
    newPackage?.template.length ? newPackage.template : [],
    "day",
  );

  return (
    <DefaultLayout>
      <div className="mb-4 justify-between items-end flex">
        <h1 className="mb-2 text-2xl font-bold">Packages</h1>
        <Button variant="bordered" onPress={() => selectPackage(-1)}>
          + New
        </Button>
      </div>

      <Table className="mb-4">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Price</TableColumn>
          <TableColumn>Place</TableColumn>
          <TableColumn>Number of Days</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>

        <TableBody>
          <>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>{pkg.title}</TableCell>
                <TableCell>{pkg.description}</TableCell>
                <TableCell>RM {pkg.price}</TableCell>
                <TableCell>{pkg.place}</TableCell>
                <TableCell>{pkg.numberOfDays}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="flat"
                      onPress={() => selectPackage(pkg.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={() => {
                        setPackages(packages.filter((p) => p.id !== pkg.id));
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </>
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedTemplate !== null && (
                  <h2 className="text-lg font-bold">Edit Template</h2>
                )}
              </ModalHeader>
              <ModalBody>
                {selectedTemplate !== null ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      isDisabled={true}
                      label="Day"
                      type="number"
                      value={String(selectedTemplate.day)}
                      onChange={(e) =>
                        setSelectedTemplate({
                          ...selectedTemplate,
                          day: Number(e.target.value),
                        })
                      }
                    />
                    <Input
                      label="Event"
                      value={selectedTemplate.event}
                      onChange={(e) =>
                        setSelectedTemplate({
                          ...selectedTemplate,
                          event: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Place"
                      value={selectedTemplate.place}
                      onChange={(e) =>
                        setSelectedTemplate({
                          ...selectedTemplate,
                          place: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Place Link"
                      value={selectedTemplate.placeLink}
                      onChange={(e) =>
                        setSelectedTemplate({
                          ...selectedTemplate,
                          placeLink: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Remarks"
                      value={selectedTemplate.remarks}
                      onChange={(e) =>
                        setSelectedTemplate({
                          ...selectedTemplate,
                          remarks: e.target.value,
                        })
                      }
                    />
                    <TimeInput
                      label="Time"
                      onChange={(v) => {
                        if (!v) return;

                        setSelectedTemplate({
                          ...selectedTemplate,
                          time: `${v.hour}:${v.minute} ${v.hour > 11 ? "PM" : "AM"}`,
                        });
                      }}
                    />
                    <div className="flex justify-end mb-2">
                      <Button
                        variant="flat"
                        onPress={() => {
                          if (!selectedPackage || !selectedTemplate) return;

                          if (
                            !selectedTemplate.day ||
                            !selectedTemplate.event ||
                            !selectedTemplate.place
                          ) {
                            addToast({
                              title: "Incomplete fields",
                              description:
                                "Please fill in all fields before submitting.",
                              color: "warning",
                            });

                            return;
                          }

                          const updatedTemplates = [
                            ...selectedPackage.template,
                          ];

                          if (selectedTemplateIndex === null) {
                            updatedTemplates.push(selectedTemplate);
                          } else {
                            updatedTemplates[selectedTemplateIndex] =
                              selectedTemplate;
                          }

                          setNewPackage({
                            ...newPackage,
                            template: updatedTemplates,
                          });
                          setSelectedPackage({
                            ...selectedPackage,
                            template: updatedTemplates,
                          });
                          setSelectedTemplate(null);
                          setSelectedTemplateIndex(null);
                          onClose();
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>No template selected</div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {selectedPackage !== null ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <h2>{selectedPackage.id > -1 ? "Edit Package" : "New Package"}</h2>
            <Input
              defaultValue={selectedPackage?.title}
              label="Name"
              placeholder="Enter package name"
              value={newPackage.title}
              onChange={(e) => {
                setNewPackage({ ...newPackage, title: e.target.value });
              }}
            />
            <Input
              defaultValue={selectedPackage?.description}
              label="Description"
              placeholder="Enter package description"
              value={newPackage.description}
              onChange={(e) => {
                setNewPackage({ ...newPackage, description: e.target.value });
              }}
            />
            <Input
              defaultValue={String(selectedPackage?.price)}
              label="Price"
              placeholder="Enter package price"
              type="number"
              value={String(newPackage.price)}
              onChange={(e) => {
                setNewPackage({ ...newPackage, price: Number(e.target.value) });
              }}
            />
            <Input
              defaultValue={selectedPackage?.place}
              label="Place"
              placeholder="Enter package place"
              value={newPackage.place}
              onChange={(e) => {
                setNewPackage({ ...newPackage, place: e.target.value });
              }}
            />
            <Input
              defaultValue={String(selectedPackage?.numberOfDays)}
              label="No. of days"
              placeholder="Enter number of days"
              type="number"
              value={String(newPackage.numberOfDays)}
              onChange={(e) => {
                setNewPackage({
                  ...newPackage,
                  numberOfDays: Number(e.target.value),
                });
              }}
            />
            <div className="flex justify-end">
              <Button variant="flat" onPress={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
          <div>
            {!isEmpty(templateByDays) &&
              Object.entries(templateByDays).map(([day, events]) => (
                <div key={day} className="flex flex-col gap-1 mb-4">
                  <div className="flex justify-start gap-4 items-center">
                    <h3>Day {day}</h3>{" "}
                    <PlusCircle
                      className="cursor-pointer"
                      size={17}
                      onClick={() => {
                        setSelectedTemplate({
                          day: Number(day),
                          event: "",
                          place: "",
                          placeLink: "",
                          remarks: "",
                          time: "",
                        });
                        onOpen();
                      }}
                    />
                  </div>
                  {events.map((event, idx) => (
                    <div
                      key={idx}
                      className="py-2 px-4 flex flex-col gap-1 justify-start items-start bg-default-100 rounded-xl"
                    >
                      <div className="flex gap-2 items-center justify-between w-full">
                        <span className="flex gap-2 justify-start items-center">
                          <span className="text-default-500 font-semibold">
                            {event.time ? `${event.time}` : ""}
                          </span>
                          {event.event ? `${event.event}` : "No Event"}{" "}
                          {event.place ? `@ ${event.place}` : ""}
                          {event.placeLink && (
                            <a
                              href={event.placeLink}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <LinkIcon />
                            </a>
                          )}
                        </span>
                        <button
                          className="cursor-pointer py-1 px-4 -mr-4"
                          onClick={() => {
                            setSelectedTemplate(event);
                            setSelectedTemplateIndex(idx);
                            onOpen();
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                      <span className="text-default-400 text-start">
                        {event.remarks}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div />
      )}
    </DefaultLayout>
  );
}
