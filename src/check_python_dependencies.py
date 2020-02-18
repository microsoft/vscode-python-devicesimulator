# from https://stackoverflow.com/questions/16294819/check-if-my-python-has-all-required-packages
import sys
import pkg_resources

with open(f"{sys.path[0]}/requirements.txt") as f:
    dependencies = [x.strip() for x in f.readlines()]

# here, if a dependency is not met, a DistributionNotFound or VersionConflict
# exception is thrown.
pkg_resources.require(dependencies)
