#!/usr/bin/env python3

import os
import os.path
import subprocess

import utility


class InvalidGitHashException(Exception):
    def __init__(self, hash):
        message = '"{}" is not a valid Git hash string'.format(hash)
        super(InvalidGitHashException, self).__init__(message)


class InvalidCommitException(Exception):
    def __init__(self, commit):
        message = '"{}" is not a valid commit'.format(commit)
        super(InvalidCommitException, self).__init__(message)


def rev_parse_commit(commit):
    try:
        return utility.sh(
            ['git', 'rev-parse', '--verify', '--quiet', commit + '^{commit}']
        )
    except subprocess.CalledProcessError:
        raise InvalidCommitException(commit)


def main():
    env = {
        'GIT_DIR': os.path.join(
            utility.sh(['git', 'rev-parse', '--show-toplevel']),
            '.git'
        ),
        'GIT_WORK_TREE': utility.sh(['git', 'rev-parse', '--show-toplevel']),
        'GIT_INDEX_FILE': utility.tmp_file(),
    }

    # Clear the index file
    utility.sh(['rm', '-f', env['GIT_INDEX_FILE']])

    def git(args):
        return utility.sh(['git'] + args, env=env)

    head_hash = rev_parse_commit('HEAD')
    deploy_hash = rev_parse_commit('deploy')

    git(['add', 'Procfile', 'package.json', 'npm-shrinkwrap.json'])
    git(['add', '-f', 'dist'])
    git(['add', 'server.js'])
    tree = git(['write-tree'])
    commit = git(['commit-tree', tree, '-p', deploy_hash, '-m', "deploy " + head_hash])


    git(['update-ref', 'deploy', commit])
    git(['push', 'origin', 'deploy'])
    print('New commit: ', commit)

if __name__ == "__main__":
    main()
