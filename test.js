const { execSync } = require("child_process");

try {
  const res = execSync("echo 'hello world'").toString();
  console.log({ res });
} catch (err) {
  console.log({ err });
}
