type FeaturedInstrumentVideoProps = {
  category: string;
};

const categoryVideoMap = {
  OSCILLOSCOPES: {
    url: "https://www.youtube.com/embed/NqPW7pG3NZs?si=P374jJmZNKatbExq",
    hero: "Measure signal width and phase with a Tektronix oscilloscope",
  },

  DAQ_BOARDS: {
    url: "https://www.youtube.com/embed/ph64DXjX1-8?si=MdY5XjyGhpbTEswx",
    hero: "Record temperature over time with a LabJack DAQ board",
  },

  MULTIMETERS: {
    url: "https://www.youtube.com/embed/jaN89-ijxL0?si=ytXVo41QkjADx8us",
    hero: "Record voltage over time with an Agilent 34401A multimeter",
  },

  POWER_SUPPLIES: {
    url: "https://www.youtube.com/embed/OEzThwlCU1s?si=9HcGT7Kij5h9GoSe",
    hero: "Measure a solar panel IV curve with a Keithley 2400",
  },

  MOTOR_CONTROLLERS: {
    url: "https://www.youtube.com/embed/6NBlT6VWQW0?si=FqTfe1WJTMcoNilq",
    hero: "Send commands to a Polulu stepper motor driver",
  },
};

export default function FeaturedInstrumentVideo({
  category,
}: FeaturedInstrumentVideoProps) {
  if (!(category in categoryVideoMap)) {
    return <></>;
  }
  const video = categoryVideoMap[category as keyof typeof categoryVideoMap];

  return (
    <div className="mb-20 mt-20">
      <h2>Demo: {video.hero}</h2>
      <iframe
        src={video.url}
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
