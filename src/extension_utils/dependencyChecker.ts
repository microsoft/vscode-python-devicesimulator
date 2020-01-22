import * as cp from "child_process";
import * as compareVersions from 'compare-versions';
import * as os from "os";
import * as util from "util";
import { CONSTANTS } from "../constants";
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
