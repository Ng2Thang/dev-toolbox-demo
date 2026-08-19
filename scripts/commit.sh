#!/usr/bin/env bash
set -e

MESSAGE="$1"

PATTERN='^(feat|fix|docs|refactor|test|chore)(\([a-zA-Z0-9_-]+\))?: .{1,72}$'

if [[ ! "$MESSAGE" =~ $PATTERN ]]; then
  echo "Invalid commit message."
  echo
  echo "Required format:"
  echo "  <type>(<scope>): <description>"
  echo
  echo "Allowed types:"
  echo "  feat, fix, docs, refactor, test, chore"
  echo
  echo "Example:"
  echo "  feat(auth): add login validation"
  exit 1
fi

git commit -m "$MESSAGE"