#!/usr/bin/env python3
import os
import os.path
import shutil
import subprocess
import atexit
import tempfile
import logging

# All temporary files and directories created during
# the execution of this program. Used for cleanup.
if "TMP_FILES" not in globals():
    TMP_FILES = []
if "TMP_DIRS" not in globals():
    TMP_DIRS = []


# Run a process in a clean environment
def sh(args, env=None, stderr=None, cwd=None):
    env = env or {}
    default_env = {
        'USER': os.getenv('USER', default=None),
        'HOME': os.getenv('HOME', default=None),
    }
    default_env.update(env)

    # Remove all None values from the environment
    default_env = {k: v for k, v in default_env.items() if v is not None}

    logging.debug(' '.join(args))
    command = which(args[0])
    return subprocess.run(
        [command] + args[1:],
        stdout=subprocess.PIPE,
        stderr=stderr,
        check=True,
        env=default_env,
        cwd=cwd,
        universal_newlines=True,
        bufsize=-1,
    ).stdout.strip('\n')


# Return the absolute path to the given executable. Raises an exception if not found.
def which(cmd):
    import distutils.spawn

    path = distutils.spawn.find_executable(cmd)
    if not path:
        raise Exception("Command not found: " + cmd)
    return abspath(path)


# Return the canonical, normalized, absolute path for the given file or directory.
def abspath(path):
    return os.path.realpath(path)


# Return the contents of the given file as a string
def read_file(filename):
    with open(filename) as f:
        return f.read()


# Create a temporary file with the given contents. The file will be deleted on
# exit unless `keep=True`.
def request_file(contents, keep=False):
    import textwrap

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        name = tmp.name
        if not keep:
            TMP_FILES.append(name)

        tmp.write(textwrap.dedent(contents.strip('\n')).encode('utf-8'))
        return name


# Create a temporary file that is automatically deleted on exit unless `keep=True`.
def tmp_file(keep=False):
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        name = tmp.name
        if not keep:
            TMP_FILES.append(name)

        return name


# Create a temporary directory that is automatically deleted on exit unless `keep=True`.
def tmp_dir(keep=False):
    tmp = tempfile.mkdtemp()
    if not keep:
        TMP_DIRS.append(tmp)
    return tmp


# Remove all temporary files and directories.
@atexit.register
def cleanup():
    if len(TMP_FILES) > 0:
        logging.info("Removing temporary files")
    for f in TMP_FILES:
        try:
            logging.debug('Removing file "%s"', f)
            os.remove(f)
        except BaseException:
            pass

    if len(TMP_DIRS) > 0:
        logging.info("Removing temporary directories")
    for d in TMP_DIRS:
        logging.debug('Removing directory "%s"', d)
        shutil.rmtree(d, ignore_errors=True)
