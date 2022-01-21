#!/bin/bash

cd $(dirname "$0")
code .
pelican --autoreload --listen
