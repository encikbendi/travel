import { useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function login() {
    localStorage.setItem("loggedIn", "true");
    setIsLoggedIn(true);
  }

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");

    setIsLoggedIn(loggedIn === "true");
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <DefaultLayout>
          <section className="flex flex-col items-center text-center justify-center gap-4 py-8 md:py-10 h-full">
            <div className="inline-block max-w-lg text-center justify-center">
              <span className={title()}>
                Make travel packages simple with&nbsp;
              </span>
              <span className={title({ color: "blue" })}>HTravel&nbsp;</span>
              <span className={title()}>app.&nbsp;</span>
              <br />
              <span className={title()} />
            </div>
            <div className={subtitle({ class: "mt-4" })}>
              Travelling package planning and scheduling made easy.
            </div>
          </section>
        </DefaultLayout>
      ) : (
        <section className="flex flex-col items-center text-center justify-center gap-4 py-8 md:py-10 h-screen w-screen p-4">
          <div className="inline-block max-w-lg text-center justify-center border border-gray-300 rounded-lg p-4 w-full">
            <h1 className="text-xl font-bold">Welcome to HTravel</h1>
            <h2 className={subtitle()}>Login to Continue</h2>

            <div className="flex flex-col gap-2 items-center">
              <Input placeholder="Phone No." type="text" />
              <Input placeholder="Password" type="password" />
              <Button
                className="w-1/3"
                color="primary"
                variant="flat"
                onPress={() => login()}
              >
                Login
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
