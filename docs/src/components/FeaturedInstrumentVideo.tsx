import React from "react";

type FeaturedInstrumentVideoProps = {
  category: string;
  manufacturer: string;
};

export default function FeaturedInstrumentVideo({
  category,
  manufacturer,
}: FeaturedInstrumentVideoProps) {
  let VIDEO_URL =
    "https://www.youtube.com/embed/xvFZjo5PgG0?si=oXQsWInrLBlhAoCB&mute=1";
  let VIDEO_HERO = "NOT FOUND";

  // console.warn('Instrument category: ', category);

  switch (category) {
    case "OSCILLOSCOPES":
      VIDEO_URL =
        "https://www.youtube.com/embed/NqPW7pG3NZs?si=P374jJmZNKatbExq";
      VIDEO_HERO =
        "Measure signal width and phase with a Tektronix oscilloscope";
      break;

    case "DAQ_BOARDS":
      VIDEO_URL =
        "https://www.youtube.com/embed/ph64DXjX1-8?si=MdY5XjyGhpbTEswx";
      VIDEO_HERO = "Record temperature over time with a LabJack DAQ board";
      break;

    case "MULTIMETERS":
      VIDEO_URL =
        "https://www.youtube.com/embed/jaN89-ijxL0?si=ytXVo41QkjADx8us";
      VIDEO_HERO = "Record voltage over time with an Agilent 34401A multimeter";
      break;

    case "POWER_SUPPLIES":
      VIDEO_URL =
        "https://www.youtube.com/embed/OEzThwlCU1s?si=9HcGT7Kij5h9GoSe";
      VIDEO_HERO = "Measure a solar panel IV curve with a Keithley 2400";
      break;

    case "MOTOR_CONTROLLERS":
      VIDEO_URL =
        "https://www.youtube.com/embed/6NBlT6VWQW0?si=FqTfe1WJTMcoNilq";
      VIDEO_HERO = "Send commands to a Polulu stepper motor driver";
      break;
  }

  if (VIDEO_HERO == "NOT FOUND") {
    return <></>;
  }

  return (
    <div className="mb-20 mt-20">
      <h2>Demo: {`${VIDEO_HERO}`}</h2>
      <iframe
        src={VIDEO_URL}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          width: "560px",
          height: "315px",
        }}
      ></iframe>
    </div>
  );
}
