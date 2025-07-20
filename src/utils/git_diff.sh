#!/bin/bash

git diff --cached --unified=0 "$@" | grep -E '^[+-]' | grep -Ev '^(---|\+\+\+)'