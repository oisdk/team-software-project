#!/usr/bin/env bash

##
# This program generates some documentation for the repository.
#
# Arguments:
#       $1: The destination folder for the documentation. Defaults to ./docs.
#
# First, it converts the markdown documentation to pdf format using pandoc.
# Next, it generates documentation from the jsdoc comments in the frontend and
# the docstrings in the backend.
#
# There are some installation requirements to run it – see the top-level README.
##

if [ ! -z "$1" ]; then
        dest="$1"
else
        dest="docs"
fi

##
# Calls pandoc with a set of options.
#
# Arguments:
#       $1: The input filename.
#       $2: The output filename – usually should be .pdf.
#       $3: The resource path that will be searched for images. Uses the same
#               format as PATH.
##
function call_pandoc {
        pandoc "$1" \
                -o "$2" \
                --template docs/pandoc/templates/eisvogel.latex  \
                --standalone \
                --listings \
                --table-of-contents \
                --metadata=author:"Team 2" \
                --variable=titlepage \
                --variable=language:"en-GB" \
                --variable=colorlinks \
                --resource-path="$3" \
                --filter docs/pandoc/filters/change_link_extensions.py
}

# Creates a directory if it doesn’t exist.
# Also creates any non-existant directories on the path to the directory.
function ensure_directory {
        if [ ! -d "$1" ]; then
                mkdir -p "$1"
        fi
}

ensure_directory "$dest"/frontend/jsdoc
ensure_directory "$dest"/backend/pydoc

echo "[1/3] Running pandoc…"
call_pandoc README.md "$dest"/README.pdf .
call_pandoc CONTRIBUTING.md "$dest"/CONTRIBUTING.pdf .
call_pandoc USAGE.md "$dest"/USAGE.pdf .
call_pandoc frontend/README.md "$dest"/frontend/README.pdf frontend
call_pandoc backend/README.rst "$dest"/backend/README.pdf backend

echo "[2/3] Running jsdoc…"
rm "$dest"/frontend/jsdoc/*
jsdoc -r frontend/app -d "$dest"/frontend/jsdoc

echo "[3/3] Running pydoc…"
cd "$dest"/backend/pydoc
rm *
pydoc3 -w ../../../backend/
