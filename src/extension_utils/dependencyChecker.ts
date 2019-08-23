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
const MINIMUM_PYTHON_VERSION = "3.7.0"

export class DependencyChecker {
    constructor() { }

    public async checkDependency(dependencyName: string): Promise<IPayloadResponse> {
        let state: boolean = false;
        if (dependencyName === CONSTANTS.DEPENDENCY_CHECKER.PYTHON) {
            const userOS: string = os.platform();
            const userOnWin: boolean = userOS.indexOf("win") === 0;

            if (
                await this.runCommandVersion(CONSTANTS.DEPENDENCY_CHECKER.PYTHON3, MINIMUM_PYTHON_VERSION)
            ) {
                state = true;
                dependencyName = CONSTANTS.DEPENDENCY_CHECKER.PYTHON3;
            } else if (
                await this.runCommandVersion(CONSTANTS.DEPENDENCY_CHECKER.PYTHON, MINIMUM_PYTHON_VERSION)
            ) {
                state = true;
                dependencyName = CONSTANTS.DEPENDENCY_CHECKER.PYTHON;
            } else if (
                userOnWin &&
                (await this.runCommandVersion(
                    CONSTANTS.DEPENDENCY_CHECKER.PYTHON_LAUNCHER,
                    MINIMUM_PYTHON_VERSION
                ))
            ) {
                state = true;
                dependencyName = CONSTANTS.DEPENDENCY_CHECKER.PYTHON;
            } else {
                state = false;
            }
        } else if (dependencyName === CONSTANTS.DEPENDENCY_CHECKER.PIP3) {
            if (
                await this.runCommandVersion(CONSTANTS.DEPENDENCY_CHECKER.PIP3)
            ) {
                state = true;
                dependencyName = CONSTANTS.DEPENDENCY_CHECKER.PYTHON3;
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

    private async runCommandVersion(command: string, versionDependency?: string) {
        let installed: boolean = false;
        try {
            const { stdout } = await exec(command + " --version");
            const matches = PYTHON3_REGEX.exec(stdout);
            if (versionDependency) {
                installed = matches ? compareVersions(matches[2], versionDependency) >= 0 : false;
            } else {
                installed = true
            }
        } catch (err) {
            installed = false;
        }
        return installed;
    }
}
