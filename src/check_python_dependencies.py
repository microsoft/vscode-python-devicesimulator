# from https://stackoverflow.com/questions/16294819/check-if-my-python-has-all-required-packages
import sys
import pkg_resources
import python_constants as CONSTANTS


def check_for_dependencies():
    with open(f"{sys.path[0]}/requirements.txt") as f:
        dependencies = [x.strip() for x in f.readlines()]

    # here, if a dependency is not met, a DistributionNotFound or VersionConflict
    # exception is caught and replaced with a new exception with a clearer description.
    try:
        pkg_resources.require(dependencies)
    except (pkg_resources.DistributionNotFound, pkg_resources.VersionConflict) as e:
        raise Exception(CONSTANTS.DEPEND_ERR)


if __name__ == "__main__":
    check_for_dependencies()
