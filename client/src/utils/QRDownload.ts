import { Dispatch } from "react";
import { LabelType } from "../@types/labels";

const downloadFunction = (label: LabelType) => {
  const svg = document.getElementById(label._id);
  if (!svg) return console.log("no svg");
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return console.log("no ctx");
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const pngFile = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.id = `link_${label._id}`
    downloadLink.download = `Barrel_${label.number}`;
    downloadLink.href = `${pngFile}`;
    downloadLink.click();
  };
  img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
}

const downloadAll = (labels: LabelType[], setDownloading: Dispatch<React.SetStateAction<boolean>>) => {
  setDownloading(true);
  labels.forEach((label, i) => {
    setTimeout(() => {
      downloadFunction(label);
    }, 200 * i)
  })
  setTimeout(() => {
    setDownloading(false);
  }, labels.length * 200);
};

export default downloadAll