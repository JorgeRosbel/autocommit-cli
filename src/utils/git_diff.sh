#!/bin/bash

git diff --unified=0 "$@" | grep -E '^[+-]' | grep -Ev '^(---|\+\+\+)'