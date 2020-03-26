# from https://stackoverflow.com/questions/16294819/check-if-my-python-has-all-required-packages
import sys
import pkg_resources
import python_constants as CONSTANTS


def check_for_dependencies():
    with open(f"{sys.path[0]}/requirements.txt") as f:
        dependencies = [x.strip() for x in f.readlines()]

    cleaned_dependencies = []

    # getting names of packages from tar.gz files

    # FOR PRE-DOWNLOADED TAR.GZ FILES, ENSURE THAT
    # THERE ARE NO DASHES AFTER THE ONE THAT IS
    # AT THE END OF THE PACKAGE NAME.
    # So, it would be:
    # {package_name}-{trailing_verison_info}.tar.gz
    for dep in dependencies:
        if len(dep) > 7 and dep.strip()[-7:] == ".tar.gz":
            last_dash = dep.rfind("-")
            dep = dep[:last_dash]

        cleaned_dependencies.append(dep)

    # here, if a dependency is not met, a DistributionNotFound or VersionConflict
    # exception is caught and replaced with a new exception with a clearer description.
    try:
        pkg_resources.require(cleaned_dependencies)
    except (pkg_resources.DistributionNotFound, pkg_resources.VersionConflict) as e:
        raise Exception(CONSTANTS.DEPEND_ERR)


if __name__ == "__main__":
    check_for_dependencies()
