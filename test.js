const exec = require("await-exec");

(async function() {
  try {
    const res = await exec("echo 'hello world'");
    console.log(res);
  } catch (err) {
    console.log(err);
  }
})();
