const { upload } = require("azure-blobv2");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const data = JSON.parse(fs.readFileSync("dict/dict.json", "utf-8"));

data.forEach(async (obj) => {
  const picUpload = await upload({
    containerName: "project-irula-pictures",
    fileName: `${obj.enWord}.jpg`,
    filePath: `./assets/pictures/${obj.enWord}.jpg`,
    useConnectionString: true,
    connectionString: process.env.AZURE_BLOB_CONNECTION_STRING,
    accountName: "arizsiddiqui",
  });
  console.log(picUpload);

  const audioUpload = await upload({
    containerName: "project-irula-audio",
    fileName: `${obj.enWord}.mp3`,
    filePath: `./assets/audio/${obj.enWord}.mp3`,
    useConnectionString: true,
    connectionString: process.env.AZURE_BLOB_CONNECTION_STRING,
    accountName: "arizsiddiqui",
  });
  console.log(audioUpload);
});

async function mediaUpload(wordName) {
  const picUpload = await upload({
    containerName: "project-irula-pictures",
    filePath: `./assets/pictures/${wordName}.jpg`,
    useConnectionString: true,
    connectionString: process.env.AZURE_BLOB_CONNECTION_STRING,
    accountName: "arizsiddiqui",
  });
  console.log(picUpload);

  const audioUpload = await upload({
    containerName: "project-irula-audio",
    filePath: `./assets/audio/${wordName}.mp3`,
    useConnectionString: true,
    connectionString: process.env.AZURE_BLOB_CONNECTION_STRING,
    accountName: "arizsiddiqui",
  });
  console.log(audioUpload);
}

module.exports = mediaUpload;
