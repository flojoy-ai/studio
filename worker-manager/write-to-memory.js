/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("upath");

const filename = path.join(__dirname, "build-images.json");
const writeImageToMemory = (imageName) => {
  // Check if the file exists
  if (fs.existsSync(filename)) {
    // Read the file data
    const data = JSON.parse(fs.readFileSync(filename, "utf-8"));
    if (!data.images.includes(imageName)) {
      data.images.push(imageName);
      // Write the updated data to the file
      fs.writeFileSync(filename, JSON.stringify(data));
    }
  } else {
    // Create the file with initial data
    const data = { images: [imageName] };
    fs.writeFileSync(filename, JSON.stringify(data));
  }
};

const eraseMemoryData = () => {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
};

const getAllImages = () => {
  if (fs.existsSync(filename)) {
    // Read the file data
    const data = JSON.parse(fs.readFileSync(filename, "utf-8"));
    return data.images;
  }
  return [];
};

module.exports = { writeImageToMemory, eraseMemoryData, getAllImages };
