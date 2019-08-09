import { CONSTANTS } from "../constants";
import * as cp from "child_process";
import * as os from "os";
import * as compareVersions from 'compare-versions';
import * as util from "util";
const exec = util.promisify(cp.exec);

interface IPayloadResponse {
    payload: IDependency;

}

interface IDependency {
    dependency: string;
    installed: boolean;
}

const PYTHON3_REGEX = RegExp("^(Python )(3\\.[0-9]+\\.[0-9]+)");

export class DependencyChecker {
    constructor() { }

    public async checkDependency(dependencyName: string): Promise<IPayloadResponse> {
        let state: boolean = false;
        if (dependencyName === CONSTANTS.DEPENDENCY_CHECKER.PYTHON) {
            const userOS: string = os.platform();
            const userOnWin: boolean = userOS.indexOf("win") === 0;

            if (
                await this.runPythonVersionCommand(CONSTANTS.DEPENDENCY_CHECKER.PYTHON3)
            ) {
                state = true;
                dependencyName = CONSTANTS.DEPENDENCY_CHECKER.PYTHON3;
            } else if (
                await this.runPythonVersionCommand(CONSTANTS.DEPENDENCY_CHECKER.PYTHON)
            ) {
                state = true;
                dependencyName = CONSTANTS.DEPENDENCY_CHECKER.PYTHON;
            } else if (
                userOnWin &&
                (await this.runPythonVersionCommand(
                    CONSTANTS.DEPENDENCY_CHECKER.PYTHON_LAUNCHER
                ))
            ) {
                state = true;
                dependencyName = CONSTANTS.DEPENDENCY_CHECKER.PYTHON;
            } else {
                state = false;
            }
        }
        return {
            payload: {
                dependency: dependencyName,
                installed: state
            }
        };
    }

    private async runPythonVersionCommand(command: string) {
        let installed: boolean;
        try {
            const { stdout } = await exec(command + " --version");
            const matches = PYTHON3_REGEX.exec(stdout);
            installed = matches ? compareVersions(matches[2], "3.5.0") >= 0 : false;
        } catch (err) {
            installed = false;
        }
        return installed;
    }
}
