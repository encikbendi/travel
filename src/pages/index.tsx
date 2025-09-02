import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
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
  );
}
