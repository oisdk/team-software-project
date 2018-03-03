#!/usr/bin/env bash

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
                --variable=colorlinks \
                --resource-path="$3" \
                --filter docs/pandoc/filters/change_link_extensions.py
}

echo "[1/1] Running pandoc…"
call_pandoc README.md docs/README.pdf .
call_pandoc CONTRIBUTING.md docs/CONTRIBUTING.pdf .
call_pandoc frontend/README.md docs/frontend/README.pdf frontend
call_pandoc backend/README.rst docs/backend/README.pdf backend
