#!/bin/bash

cd $(dirname "$0")
code .
pelican --autoreload --listen

read "Press any key to publish changes. Press ctrl + c to quit without publishing."

git add -A .
git commit -m "Content update."
git push