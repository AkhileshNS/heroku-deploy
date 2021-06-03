require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 822:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __importDefault(__nccwpck_require__(186));
const steps = __importStar(__nccwpck_require__(561));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const heroku = steps.getHerokuConfig();
        // Pipeline
        steps.loginToHeroku(heroku) &&
            steps.justLogin(heroku) &&
            steps.configureGit(heroku) &&
            steps.createProcfile(heroku) &&
            steps.addRemote(heroku) &&
            steps.addConfigVars(heroku) &&
            steps.deploy(heroku) &&
            (yield steps.performHealthCheck(heroku));
    }
    catch (error) {
        core_1.default.setFailed("stderr" in error
            ? error.stderr.toString()
            : error.message.toString());
    }
}))();


/***/ }),

/***/ 279:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addConfigVars = void 0;
const core_1 = __importDefault(__nccwpck_require__(186));
const path_1 = __importDefault(__nccwpck_require__(622));
const fs_1 = __importDefault(__nccwpck_require__(747));
const util_1 = __nccwpck_require__(24);
const child_process_1 = __nccwpck_require__(129);
const addVarsFromEnv = (vars) => {
    const res = [...vars];
    for (let key in process.env) {
        if (key.startsWith("HD_")) {
            res.push(key.substring(3) + "='" + process.env[key] + "'");
        }
    }
    return res;
};
const addVarsFromEnvFile = (heroku, vars) => {
    if (heroku.env_file) {
        const env = fs_1.default.readFileSync(path_1.default.join(heroku.appdir, heroku.env_file), "utf8");
        const variables = __nccwpck_require__(153).parse(env);
        const newVars = [];
        for (let key in variables) {
            newVars.push(key + "=" + variables[key]);
        }
        return [...vars, ...newVars];
    }
    return vars;
};
const addConfigVars = (heroku) => {
    core_1.default.debug(util_1.ansi_colors.cyan + "STEP: Adding Configuration Variables from env and envfile");
    const envVars = addVarsFromEnv([]);
    const configVars = addVarsFromEnvFile(heroku, envVars);
    if (configVars.length !== 0) {
        child_process_1.execSync(`heroku config:set --app=${heroku.app_name} ${configVars.join(" ")}`);
    }
    core_1.default.info(util_1.ansi_colors.green + "STEP: Adding Configuration Variables from env and envfile - Success");
    return true;
};
exports.addConfigVars = addConfigVars;


/***/ }),

/***/ 817:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addRemote = void 0;
const core_1 = __importDefault(__nccwpck_require__(186));
const child_process_1 = __nccwpck_require__(129);
const util_1 = __nccwpck_require__(24);
const addRemote = (heroku) => {
    core_1.default.debug(util_1.ansi_colors.cyan + "STEP: Adding Remote");
    try {
        child_process_1.execSync("heroku git:remote --app " + heroku.app_name);
        core_1.default.debug("Added git remote heroku");
    }
    catch (err) {
        if (heroku.dontautocreate) {
            throw err;
        }
        child_process_1.execSync("heroku create " +
            heroku.app_name +
            (heroku.buildpack ? " --buildpack " + heroku.buildpack : "") +
            (heroku.region ? " --region " + heroku.region : "") +
            (heroku.stack ? " --stack " + heroku.stack : "") +
            (heroku.team ? " --team " + heroku.team : ""));
    }
    core_1.default.info(util_1.ansi_colors.green + "STEP: Adding Remote - Success");
    return true;
};
exports.addRemote = addRemote;


/***/ }),

/***/ 151:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.configureGit = void 0;
const core_1 = __importDefault(__nccwpck_require__(186));
const child_process_1 = __nccwpck_require__(129);
const util_1 = __nccwpck_require__(24);
const configureUserAndCommit = (heroku) => {
    child_process_1.execSync(`git config user.name "Heroku-Deploy"`);
    child_process_1.execSync(`git config user.email "${heroku.email}"`);
    if (child_process_1.execSync("git status --porcelain").toString().trim()) {
        child_process_1.execSync('git add -A && git commit -m "Commited changes from previous actions"');
    }
    return true;
};
const unshallowRepo = (heroku) => {
    if (heroku.usedocker) {
        return true;
    }
    if (child_process_1.execSync("git rev-parse --is-shallow-repository").toString().trim() === "true") {
        child_process_1.execSync("git fetch --prune --unshallow");
    }
    return true;
};
const configureGit = (heroku) => {
    core_1.default.debug(util_1.ansi_colors.cyan + "STEP: Configuring git");
    configureUserAndCommit(heroku) &&
        unshallowRepo(heroku);
    core_1.default.info(util_1.ansi_colors.green + "STEP: Configuring git - Success");
    return true;
};
exports.configureGit = configureGit;


/***/ }),

/***/ 946:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createProcfile = void 0;
const child_process_1 = __nccwpck_require__(129);
const fs_1 = __importDefault(__nccwpck_require__(747));
const path_1 = __importDefault(__nccwpck_require__(622));
const core_1 = __importDefault(__nccwpck_require__(186));
const util_1 = __nccwpck_require__(24);
const createProcfile = (heroku) => {
    if (heroku.procfile) {
        core_1.default.debug(util_1.ansi_colors.cyan + "STEP: Creating Procfile");
        fs_1.default.writeFileSync(path_1.default.join(heroku.appdir, "Procfile"), heroku.procfile);
        child_process_1.execSync(`git add -A && git commit -m "Added Procfile"`);
        core_1.default.info(util_1.ansi_colors.green + "STEP: Creating Procfile - Success");
    }
    return true;
};
exports.createProcfile = createProcfile;


/***/ }),

/***/ 241:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deploy = exports.deployGit = exports.fixRemoteBranch = exports.deployDocker = void 0;
const core_1 = __importDefault(__nccwpck_require__(186));
const child_process_1 = __nccwpck_require__(129);
const util_1 = __nccwpck_require__(24);
const deployDocker = (heroku) => {
    if (heroku.usedocker) {
        child_process_1.execSync(`heroku container:push ${heroku.dockerHerokuProcessType} --app ${heroku.app_name} ${heroku.dockerBuildArgs}`, heroku.appdir ? { cwd: heroku.appdir } : undefined);
        child_process_1.execSync(`heroku container:release ${heroku.dockerHerokuProcessType} --app ${heroku.app_name}`, heroku.appdir ? { cwd: heroku.appdir } : undefined);
        return false;
    }
    return true;
};
exports.deployDocker = deployDocker;
const fixRemoteBranch = (heroku) => {
    let remote_branch = child_process_1.execSync("git remote show heroku | grep 'HEAD' | cut -d':' -f2 | sed -e 's/^ *//g' -e 's/ *$//g'")
        .toString()
        .trim();
    if (remote_branch === "master") {
        child_process_1.execSync("heroku plugins:install heroku-repo");
        child_process_1.execSync("heroku repo:reset -a " + heroku.app_name);
    }
    return true;
};
exports.fixRemoteBranch = fixRemoteBranch;
const deployGit = (heroku, shouldThrowError = false) => {
    const force = !heroku.dontuseforce ? "--force" : "";
    const finalBranch = heroku.appdir
        ? `\`git subtree split --prefix=${heroku.appdir} ${heroku.branch}\``
        : heroku.branch;
    try {
        child_process_1.execSync(`git push ${force} heroku ${finalBranch}:refs/head/main`, { maxBuffer: 104857600 });
    }
    catch (err) {
        if (shouldThrowError) {
            throw err;
        }
        else {
            core_1.default.error(util_1.ansi_colors.red + ("stderr" in err
                ? err.stderr.toString()
                : err.message.toString()));
            return true;
        }
    }
    return false;
};
exports.deployGit = deployGit;
const deploy = (heroku) => {
    core_1.default.debug(util_1.ansi_colors.cyan + "STEP: Deploying");
    exports.deployDocker(heroku) &&
        exports.fixRemoteBranch(heroku) &&
        exports.deployGit(Object.assign(Object.assign({}, heroku), { dontuseforce: false })) &&
        exports.deployGit(heroku, true);
    core_1.default.info(util_1.ansi_colors.green + "STEP: Deploying - Success");
    return true;
};
exports.deploy = deploy;


/***/ }),

/***/ 546:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getHerokuConfig = void 0;
const core_1 = __importDefault(__nccwpck_require__(186));
const util_1 = __nccwpck_require__(24);
const formatAppdir = (appdir) => appdir[0] === "." && appdir[1] === "/"
    ? appdir.slice(2)
    : appdir[0] === "/"
        ? appdir.slice(1)
        : appdir;
const formatDockerBuildArgs = (dockerBuildArgs) => {
    const res = dockerBuildArgs
        .split("\n")
        .map((arg) => `${arg}="${process.env[arg]}"`)
        .join(",");
    return res ? "--arg " + res : "";
};
const getHerokuConfig = () => {
    core_1.default.debug(util_1.ansi_colors.cyan + "STEP: Getting Heroku Config");
    const heroku = {
        api_key: core_1.default.getInput("heroku_api_key"),
        email: core_1.default.getInput("heroku_email"),
        app_name: core_1.default.getInput("heroku_app_name"),
        buildpack: core_1.default.getInput("buildpack"),
        branch: core_1.default.getInput("branch"),
        dontuseforce: core_1.default.getInput("dontuseforce") === "false" ? false : true,
        dontautocreate: core_1.default.getInput("dontautocreate") === "false" ? false : true,
        usedocker: core_1.default.getInput("usedocker") === "false" ? false : true,
        dockerHerokuProcessType: core_1.default.getInput("docker_heroku_process_type"),
        dockerBuildArgs: formatDockerBuildArgs(core_1.default.getInput("docker_build_args")),
        appdir: formatAppdir(core_1.default.getInput("appdir")),
        healthcheck: core_1.default.getInput("healthcheck"),
        checkstring: core_1.default.getInput("checkstring"),
        delay: parseInt(core_1.default.getInput("delay")),
        procfile: core_1.default.getInput("procfile"),
        rollbackonhealthcheckfailed: core_1.default.getInput("rollbackonhealthcheckfailed") === "false" ? false : true,
        env_file: core_1.default.getInput("env_file"),
        justlogin: core_1.default.getInput("justlogin") === "false" ? false : true,
        region: core_1.default.getInput("region"),
        stack: core_1.default.getInput("stack"),
        team: core_1.default.getInput("team"),
    };
    core_1.default.info(util_1.ansi_colors.green + "STEP: Getting Heroku Config - Success");
    return heroku;
};
exports.getHerokuConfig = getHerokuConfig;


/***/ }),

/***/ 561:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.performHealthCheck = exports.deploy = exports.addConfigVars = exports.addRemote = exports.createProcfile = exports.configureGit = exports.loginToHeroku = exports.justLogin = exports.getHerokuConfig = void 0;
var getHerokuConfig_1 = __nccwpck_require__(546);
Object.defineProperty(exports, "getHerokuConfig", ({ enumerable: true, get: function () { return getHerokuConfig_1.getHerokuConfig; } }));
var justLogin_1 = __nccwpck_require__(580);
Object.defineProperty(exports, "justLogin", ({ enumerable: true, get: function () { return justLogin_1.justLogin; } }));
var loginToHeroku_1 = __nccwpck_require__(460);
Object.defineProperty(exports, "loginToHeroku", ({ enumerable: true, get: function () { return loginToHeroku_1.loginToHeroku; } }));
var configureGit_1 = __nccwpck_require__(151);
Object.defineProperty(exports, "configureGit", ({ enumerable: true, get: function () { return configureGit_1.configureGit; } }));
var createProcfile_1 = __nccwpck_require__(946);
Object.defineProperty(exports, "createProcfile", ({ enumerable: true, get: function () { return createProcfile_1.createProcfile; } }));
var addRemote_1 = __nccwpck_require__(817);
Object.defineProperty(exports, "addRemote", ({ enumerable: true, get: function () { return addRemote_1.addRemote; } }));
var addConfigVars_1 = __nccwpck_require__(279);
Object.defineProperty(exports, "addConfigVars", ({ enumerable: true, get: function () { return addConfigVars_1.addConfigVars; } }));
var deploy_1 = __nccwpck_require__(241);
Object.defineProperty(exports, "deploy", ({ enumerable: true, get: function () { return deploy_1.deploy; } }));
var performHealthCheck_1 = __nccwpck_require__(283);
Object.defineProperty(exports, "performHealthCheck", ({ enumerable: true, get: function () { return performHealthCheck_1.performHealthCheck; } }));


/***/ }),

/***/ 580:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.justLogin = void 0;
// IF justlogin = true, then return false and stop the pipeline
// else return true and continue the pipeline
const justLogin = (heroku) => !heroku.justlogin;
exports.justLogin = justLogin;


/***/ }),

/***/ 460:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loginToHeroku = void 0;
const util_1 = __nccwpck_require__(24);
const core_1 = __importDefault(__nccwpck_require__(186));
const child_process_1 = __nccwpck_require__(129);
const createCatFile = ({ email, api_key }) => `cat >~/.netrc <<EOF
machine api.heroku.com
    login ${email}
    password ${api_key}
machine git.heroku.com
    login ${email}
    password ${api_key}
EOF`;
const loginToHeroku = (heroku) => {
    core_1.default.debug(util_1.ansi_colors.cyan + "STEP: Login to Heroku");
    child_process_1.execSync(createCatFile(heroku));
    if (heroku.usedocker) {
        child_process_1.execSync("heroku container:login");
    }
    core_1.default.info(util_1.ansi_colors.green + "STEP: Login to Heroku - Success");
    return true;
};
exports.loginToHeroku = loginToHeroku;


/***/ }),

/***/ 283:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.performHealthCheck = void 0;
const core_1 = __importDefault(__nccwpck_require__(186));
const util_1 = __nccwpck_require__(24);
const phin_1 = __importDefault(__nccwpck_require__(384));
const child_process_1 = __nccwpck_require__(129);
const delay = (heroku) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof heroku.delay === "number" && heroku.delay !== NaN) {
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        yield sleep(heroku.delay * 1000);
    }
    return true;
});
const healthcheck = (heroku) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield phin_1.default(heroku.healthcheck);
    if (res.statusCode !== 200) {
        core_1.default.error(`${util_1.ansi_colors.red}Status code of network request is not 200: Status code - ${res.statusCode}`);
        return true;
    }
    if (heroku.checkstring && heroku.checkstring !== res.body.toString()) {
        core_1.default.error(util_1.ansi_colors.red + "Failed to match the checkstring");
        return true;
    }
    core_1.default.info(res.body.toString());
    return false;
});
const rollback = (heroku) => {
    if (heroku.rollbackonhealthcheckfailed) {
        child_process_1.execSync(`heroku rollback --app ${heroku.app_name}`, heroku.appdir ? { cwd: heroku.appdir } : undefined);
        throw new Error("Health Check Failed. Error deploying Server. Deployment has been rolled back. Please check your logs on Heroku to try and diagnose the problem");
    }
    else {
        throw new Error("Health Check Failed. Error deploying Server. Please check your logs on Heroku to try and diagnose the problem");
    }
};
const performHealthCheck = (heroku) => __awaiter(void 0, void 0, void 0, function* () {
    core_1.default.debug(util_1.ansi_colors.cyan + "STEP: Performing HealthCheck");
    if (heroku.healthcheck) {
        (yield delay(heroku)) &&
            (yield healthcheck(heroku)) &&
            rollback(heroku);
    }
    core_1.default.info(util_1.ansi_colors.green + "STEP: Performing HealthCheck - Success");
    return true;
});
exports.performHealthCheck = performHealthCheck;


/***/ }),

/***/ 24:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ansi_colors = void 0;
exports.ansi_colors = {
    green: '\u001b[31m',
    cyan: '\u001b[36m',
    magenta: '\u001b[35m',
    blue: '\u001b[94m',
    red: '\u001b[91m'
};


/***/ }),

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(278);
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(747));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 67:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const CentraRequest = __nccwpck_require__(755)

module.exports = (url, method) => {
	return new CentraRequest(url, method)
}

/***/ }),

/***/ 755:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const path = __nccwpck_require__(622)
const http = __nccwpck_require__(605)
const https = __nccwpck_require__(211)
const qs = __nccwpck_require__(191)
const zlib = __nccwpck_require__(761)
const {URL} = __nccwpck_require__(835)

const CentraResponse = __nccwpck_require__(386)

const supportedCompressions = ['gzip', 'deflate']

module.exports = class CentraRequest {
	constructor (url, method = 'GET') {
		this.url = typeof url === 'string' ? new URL(url) : url
		this.method = method
		this.data = null
		this.sendDataAs = null
		this.reqHeaders = {}
		this.streamEnabled = false
		this.compressionEnabled = false
		this.timeoutTime = null
		this.coreOptions = {}

		this.resOptions = {
			'maxBuffer': 50 * 1000000 // 50 MB
		}

		return this
	}

	query (a1, a2) {
		if (typeof a1 === 'object') {
			Object.keys(a1).forEach((queryKey) => {
				this.url.searchParams.append(queryKey, a1[queryKey])
			})
		}
		else this.url.searchParams.append(a1, a2)

		return this
	}

	path (relativePath) {
		this.url.pathname = path.join(this.url.pathname, relativePath)

		return this
	}

	body (data, sendAs) {
		this.sendDataAs = typeof data === 'object' && !sendAs && !Buffer.isBuffer(data) ? 'json' : (sendAs ? sendAs.toLowerCase() : 'buffer')
		this.data = this.sendDataAs === 'form' ? qs.stringify(data) : (this.sendDataAs === 'json' ? JSON.stringify(data) : data)

		return this
	}

	header (a1, a2) {
		if (typeof a1 === 'object') {
			Object.keys(a1).forEach((headerName) => {
				this.reqHeaders[headerName.toLowerCase()] = a1[headerName]
			})
		}
		else this.reqHeaders[a1.toLowerCase()] = a2

		return this
	}

	timeout (timeout) {
		this.timeoutTime = timeout

		return this
	}

	option (name, value) {
		this.coreOptions[name] = value

		return this
	}

	stream () {
		this.streamEnabled = true

		return this
	}

	compress () {
		this.compressionEnabled = true

		if (!this.reqHeaders['accept-encoding']) this.reqHeaders['accept-encoding'] = supportedCompressions.join(', ')

		return this
	}

	send () {
		return new Promise((resolve, reject) => {
			if (this.data) {
				if (!this.reqHeaders.hasOwnProperty('content-type')) {
					if (this.sendDataAs === 'json') {
						this.reqHeaders['content-type'] = 'application/json'
					}
					else if (this.sendDataAs === 'form') {
						this.reqHeaders['content-type'] = 'application/x-www-form-urlencoded'
					}
				}

				if (!this.reqHeaders.hasOwnProperty('content-length')) {
					this.reqHeaders['content-length'] = Buffer.byteLength(this.data)
				}
			}

			const options = Object.assign({
				'protocol': this.url.protocol,
				'host': this.url.hostname,
				'port': this.url.port,
				'path': this.url.pathname + (this.url.search === null ? '' : this.url.search),
				'method': this.method,
				'headers': this.reqHeaders
			}, this.coreOptions)

			let req

			const resHandler = (res) => {
				let stream = res

				if (this.compressionEnabled) {
					if (res.headers['content-encoding'] === 'gzip') {
						stream = res.pipe(zlib.createGunzip())
					}
					else if (res.headers['content-encoding'] === 'deflate') {
						stream = res.pipe(zlib.createInflate())
					}
				}

				let centraRes

				if (this.streamEnabled) {
					resolve(stream)
				}
				else {
					centraRes = new CentraResponse(res, this.resOptions)

					stream.on('error', (err) => {
						reject(err)
					})

					stream.on('data', (chunk) => {
						centraRes._addChunk(chunk)

						if (this.resOptions.maxBuffer !== null && centraRes.body.length > this.resOptions.maxBuffer) {
							stream.destroy()

							reject('Received a response which was longer than acceptable when buffering. (' + this.body.length + ' bytes)')
						}
					})

					stream.on('end', () => {
						resolve(centraRes)
					})
				}
			}

			if (this.url.protocol === 'http:') {
				req = http.request(options, resHandler)
			}
			else if (this.url.protocol === 'https:') {
				req = https.request(options, resHandler)
			}
			else throw new Error('Bad URL protocol: ' + this.url.protocol)

			if (this.timeoutTime) {
				req.setTimeout(this.timeoutTime, () => {
					req.abort()

					if (!this.streamEnabled) {
						reject(new Error('Timeout reached'))
					}
				})
			}

			req.on('error', (err) => {
				reject(err)
			})

			if (this.data) req.write(this.data)

			req.end()
		})
	}
}


/***/ }),

/***/ 386:
/***/ ((module) => {

module.exports = class CentraResponse {
	constructor (res, resOptions) {
		this.coreRes = res
		this.resOptions = resOptions

		this.body = Buffer.alloc(0)

		this.headers = res.headers
		this.statusCode = res.statusCode
	}

	_addChunk (chunk) {
		this.body = Buffer.concat([this.body, chunk])
	}

	async json () {
		return this.statusCode === 204 ? null : JSON.parse(this.body)
	}

	async text () {
		return this.body.toString()
	}
}

/***/ }),

/***/ 384:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const {URL} = __nccwpck_require__(835)

const centra = __nccwpck_require__(67)

/**
* phin options object. phin also supports all options from <a href="https://nodejs.org/api/http.html#http_http_request_options_callback">http.request(options, callback)</a> by passing them on to this method (or similar).
* @typedef {Object} phinOptions
* @property {string} url - URL to request (autodetect infers from this URL)
* @property {string} [method=GET] - Request method ('GET', 'POST', etc.)
* @property {string} [data] - Data to send as request body (phin may attempt to convert this data to a string if it isn't already)
* @property {Object} [form] - Object to send as form data (sets 'Content-Type' and 'Content-Length' headers, as well as request body) (overwrites 'data' option if present)
* @property {Object} [headers={}] - Request headers
* @property {Object} [core={}] - Custom core HTTP options
* @property {string} [parse=none] - Response parsing. Errors will be given if the response can't be parsed. ('none', 'json')
* @property {boolean} [followRedirects=false] - Enable HTTP redirect following
* @property {boolean} [stream=false] - Enable streaming of response. (Removes body property)
* @property {boolean} [compression=false] - Enable compression for request
* @property {?number} [timeout=null] - Request timeout in milliseconds
* @property {string} [hostname=autodetect] - URL hostname
* @property {Number} [port=autodetect] - URL port
* @property {string} [path=autodetect] - URL path
*/

/**
* Response data
* @callback phinResponseCallback
* @param {?(Error|string)} error - Error if any occurred in request, otherwise null.
* @param {?http.serverResponse} phinResponse - phin response object. Like <a href='https://nodejs.org/api/http.html#http_class_http_serverresponse'>http.ServerResponse</a> but has a body property containing response body, unless stream. If stream option is enabled, a stream property will be provided to callback with a readable stream.
*/

/**
* Sends an HTTP request
* @param {phinOptions|string} options - phin options object (or string for auto-detection)
* @returns {Promise<http.serverResponse>} - phin-adapted response object
*/
const phin = async (opts) => {
	if (typeof(opts) !== 'string') {
		if (!opts.hasOwnProperty('url')) {
			throw new Error('Missing url option from options for request method.')
		}
	}

	const req = centra(typeof opts === 'object' ? opts.url : opts, opts.method || 'GET')

	if (opts.headers) req.header(opts.headers)
	if (opts.stream) req.stream()
	if (opts.timeout) req.timeout(opts.timeout)
	if (opts.data) req.body(opts.data)
	if (opts.form) req.body(opts.form, 'form')
	if (opts.compression) req.compress()

	if (typeof opts.core === 'object') {
		Object.keys(opts.core).forEach((optName) => {
			req.option(optName, opts.core[optName])
		})
	}

	const res = await req.send()

	if (res.headers.hasOwnProperty('location') && opts.followRedirects) {
		opts.url = (new URL(res.headers['location'], opts.url)).toString()

		return await phin(opts)
	}

	if (opts.stream) {
		res.stream = res

		return res
	}
	else {
		res.coreRes.body = res.body

		if (opts.parse && opts.parse === 'json') {
			res.coreRes.body = await res.json()

			return res.coreRes
		}
		else return res.coreRes
	}
}

// If we're running Node.js 8+, let's promisify it

phin.promisified = phin

phin.unpromisified = (opts, cb) => {
	phin(opts).then((data) => {
		if (cb) cb(null, data)
	}).catch((err) => {
		if (cb) cb(err, null)
	})
}

// Defaults

phin.defaults = (defaultOpts) => async (opts) => {
	const nops = typeof opts === 'string' ? {'url': opts} : opts

	Object.keys(defaultOpts).forEach((doK) => {
		if (!nops.hasOwnProperty(doK) || nops[doK] === null) {
			nops[doK] = defaultOpts[doK]
		}
	})

	return await phin(nops)
}

module.exports = phin


/***/ }),

/***/ 153:
/***/ ((module) => {

module.exports = eval("require")("dotenv");


/***/ }),

/***/ 129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 191:
/***/ ((module) => {

"use strict";
module.exports = require("querystring");;

/***/ }),

/***/ 835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(822);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map