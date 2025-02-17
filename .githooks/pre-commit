#!/bin/sh

set -x

composer run fix

# Check if any files were modified by the formatting
if [ -n "$(git diff --name-only)" ]; then
    # Store the commit message
    commit_msg=$(git log --format=%B -n 1 HEAD)

    # Add the modified files back to staging
    git add .

    # Create a new commit with the same message
    git commit --amend -C HEAD --no-verify

    # Exit successfully
    exit 0
fi

# If no files were modified, continue with the original commit
exit 0
