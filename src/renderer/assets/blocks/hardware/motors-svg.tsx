import { memo } from "react";
import { resolveBlockSVG } from "../svg-helper";

const DefaultMotorSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100pt"
    height="100pt"
    viewBox="0 0 100 100"
  >
    <path
      className="fill-accent4"
      d="M40.625 30.652a.763.763 0 00-.762.762v3.43l-.3.035a.469.469 0 00-.407.382l-.05.278c-.2.105-.38.242-.555.39h-4.547a2.925 2.925 0 00-2.922 2.922v4.34l-.535-.004a.33.33 0 00-.328.332v2.047H21.64a.335.335 0 00-.235.098l-.172.172a.328.328 0 00-.097.234v5.273c0 .086.035.172.097.235l.172.176a.324.324 0 00.235.093l8.578-.004v2.051c0 .18.148.328.328.328h.539v11.445h-.106a.33.33 0 00-.328.328v3.028c0 .18.149.324.328.324h31.992c.18 0 .329-.145.329-.324v-3.028a.33.33 0 00-.329-.328h-5.347V59.84h13.844c.133 0 .25-.078.3-.199l.008-.02c.047.122.145.22.285.22h4.743a2.061 2.061 0 002.058-2.06V39.626a2.059 2.059 0 00-2.058-2.059h-4.743c-.14 0-.238.102-.285.223l-.011-.024a.324.324 0 00-.301-.199H56.297a.321.321 0 00-.274.152l-1.105 1.75H51.71v-.625a2.922 2.922 0 00-2.922-2.922l-6.086.004a3.385 3.385 0 00-.555-.39l-.047-.278a.477.477 0 00-.406-.382l-.3-.036v-3.43a.76.76 0 00-.762-.761zm.004.676c.05 0 .105.031.105.09v3.722a.33.33 0 00.293.325l.453.054.055.301a.3.3 0 00.047.11H39.68c.02-.036.043-.07.047-.11l.054-.3.453-.055a.329.329 0 00.293-.325v-3.722c0-.059.051-.09.102-.09zm-6.625 5.258h14.785a2.267 2.267 0 012.266 2.265v16.445h-9.2a2.928 2.928 0 00-2.922 2.926v7.453l-7.195-.004v-26.82a2.267 2.267 0 012.266-2.265zm38.383 1.644h4.418c.773 0 1.402.629 1.402 1.402v18.156c0 .774-.629 1.403-1.402 1.403l-4.418-.004zM56.48 39.293h14.77l.094.218-15-.004zm-4.77.84h1.68v15.163h-1.68zm2.336 0h.727v15.171c-.024 0-.05-.011-.074-.011h-.653zm2.434.035h14.77l.281.652c-.023-.004-.043-.02-.066-.02l-15.164-.004a.328.328 0 00-.278.153l-.593.941v-.062zm0 1.289h14.77l.394.918a.315.315 0 00-.18-.055l-15.163-.004a.328.328 0 00-.278.152l-.593.942v-.293zm0 1.523h14.77l.48 1.113v.778a.322.322 0 00-.265-.153l-15.164-.004a.333.333 0 00-.278.153l-.593.941v-1.164zm-25.605.871h.21v9.723h-.21zm25.605 1.524h14.77l.48 1.117v4.441l-.48 1.117-14.77-.007-1.05-1.668v-3.34zm-34.688.855l8.426-.004v4.965l-8.426-.004v-1.371h4.344c.61 0 1.105-.496 1.105-1.106 0-.613-.496-1.105-1.105-1.105l-4.344-.004zm0 2.031l4.344-.004a.453.453 0 010 .906l-4.344-.003zM55.43 51.61l.594.941a.32.32 0 00.277.153h15.164v-.004a.32.32 0 00.266-.156v.777l-.48 1.117-14.77.004-1.052-1.668zm0 2.394l.594.942a.32.32 0 00.277.152h15.164c.066 0 .129-.02.184-.058l-.399.925-14.719-.004c-.035-.03-.066-.054-.101-.082l-1-1.593zm-13.578 1.954h11.863c.004 0 .004.003.004.003.004 0 .004-.003.004-.003h.976c1.25 0 2.27 1.015 2.27 2.269v.227c0 .004-.004.004-.004.004 0 .003.004.003.004.003v.59c0 .004-.004.004-.004.004 0 .004.004.004.004.004v.453c0 .004-.004.004-.004.004 0 .004.004.004.004.004v6.148H39.586v-7.453a2.27 2.27 0 012.265-2.27zm29.68.644l-.281.652-13.805-.007a2.755 2.755 0 00-.305-.63h14.328c.023 0 .043-.015.062-.019zM57.594 57.91h13.754l-.094.218-13.64-.003a3.794 3.794 0 00-.02-.22zm-26.285 8.422h.101c.004 0 .004.003.004.003.004 0 .004-.003.004-.003h7.836c.004 0 .004.003.004.003.004 0 .004-.003.004-.003h18.027c.004 0 .004.003.004.003.004 0 .004-.003.004-.003h5.344v2.37l-31.332-.007z"
    ></path>
  </svg>
);

const blockNameToSVGMap = {
  default: DefaultMotorSVG,
};
export default memo(resolveBlockSVG(blockNameToSVGMap));