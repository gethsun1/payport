import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const artifactPath = resolve(
  "contracts",
  "out",
  "PayPortSettlement.sol",
  "PayPortSettlement.json"
);
const abiPath = resolve("packages", "shared", "src", "abi", "PayPortSettlement.json");

try {
  const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
  if (!Array.isArray(artifact.abi)) {
    throw new Error("Foundry artifact does not contain an ABI array.");
  }

  await mkdir(dirname(abiPath), { recursive: true });
  await writeFile(abiPath, `${JSON.stringify(artifact.abi, null, 2)}\n`);
  console.log(`Exported PayPortSettlement ABI to ${abiPath}`);
} catch (error) {
  console.error("Unable to export PayPortSettlement ABI.");
  console.error(`Expected Foundry artifact at ${artifactPath}`);
  console.error("Run `npm run contracts:build` first, then retry.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
