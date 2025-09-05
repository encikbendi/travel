import { Accordion, AccordionItem } from "@heroui/accordion";
import { MapPinIcon } from "lucide-react";
import { Button } from "@heroui/button";
import { groupBy } from "lodash-es";
import { Link } from "@heroui/link";

import { schedulesData } from "@/data/schedules";
import DefaultLayout from "@/layouts/default";

export default function TripsPage() {
  return (
    <DefaultLayout>
      <h1 className="text-2xl font-bold">My Trips</h1>
      <Accordion>
        {schedulesData.map((data) => {
          const scheduleByDay = groupBy(data.schedule, "day");

          return (
            <AccordionItem
              key={data.id}
              title={`${data.title} @ ${data.place}`}
            >
              {Object.entries(scheduleByDay).map(([day, items]) => (
                <div key={day} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-default-500">
                    Day {day}
                  </h3>
                  {items.map((item, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{item.event}</p>
                        {item.placeLink ? (
                          <Link
                            href={item.placeLink}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <Button
                              className="flex items-center gap-2 -mr-4"
                              variant="light"
                            >
                              <p className="text-sm text-default-600">
                                {item.place}
                              </p>
                              <MapPinIcon
                                className="cursor-pointer"
                                size={16}
                              />
                            </Button>
                          </Link>
                        ) : (
                          <p className="text-sm text-default-600 p-2 -mr-2">
                            {item.place}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-start">
                        {item.remarks ? (
                          <p className="text-sm text-default-600 text-wrap max-w-3/4 pr-2">
                            {item.remarks}
                          </p>
                        ) : (
                          <div />
                        )}
                        <span className="text-sm text-default-600">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </AccordionItem>
          );
        })}
      </Accordion>
    </DefaultLayout>
  );
}
