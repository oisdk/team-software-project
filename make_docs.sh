#!/usr/bin/env bash

##
# This program generates some documentation for the repository.
#
# First, it converts the markdown documentation to pdf format using pandoc.
# Next, it generates documentation from the jsdoc comments in the frontend and
# the docstrings in the backend.
#
# Several things are required to be installed for this script to run
# successfully. At the top level:
#
#       - pandoc (https://pandoc.org/)
#       - jsdoc (https://github.com/jsdoc3/jsdoc)
#       - pydoc (should be installed with python)
#
# As well as that, however, pandoc requires a few other things to be installed:
#
#       - latex
#       - pdflatex
#               * Pandoc can be run with alternative pdf engines if you
#                 need, but you’ll have to modify the script.
#       - rsvg2pdf
#               * This is needed for converting the svg images we’ve used. On
#                 macOS you can use brew: `brew install librsvg`. I think
#                 linux is similar, with whatever your package manager is.
#                 Windows is a mystery.
##

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

function ensure_directory {
        if [ ! -d "$1" ]; then
                mkdir -p "$1"
        fi
}

ensure_directory docs/frontend/jsdoc
ensure_directory docs/backend/pydoc

echo "[1/3] Running pandoc…"
call_pandoc README.md docs/README.pdf .
call_pandoc CONTRIBUTING.md docs/CONTRIBUTING.pdf .
call_pandoc frontend/README.md docs/frontend/README.pdf frontend
call_pandoc backend/README.rst docs/backend/README.pdf backend

echo "[2/3] Running jsdoc…"
rm docs/frontend/jsdoc/*
jsdoc -r frontend/app -d docs/frontend/jsdoc

echo "[3/3] Running pydoc…"
cd docs/backend/pydoc
rm *
pydoc3 -w ../../../backend/
