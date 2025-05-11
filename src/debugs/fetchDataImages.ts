import fs from "fs";
const jsCode = fs.readFileSync("./src/debugs/app.fb435cff.js", "utf-8");
const regex = /img\/(\d+)\.([a-f0-9]+)\.png/g;

const result: Record<string, string> = {};
let match;

while ((match = regex.exec(jsCode)) !== null) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, id, hash] = match;
    result[id] = hash;
}
console.log(result);
fs.writeFileSync("./src/debugs/images.json", JSON.stringify(result, null, 2));
