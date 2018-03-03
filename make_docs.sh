#!/usr/bin/env bash

pandoc backend/readme.rst \
        -o docs/backend/readme.pdf \
        --template docs/templates/eisvogel.latex  \
        --standalone \
        --listings \
        --table-of-contents \
        --variable=titlepage \
        --resource-path=backend

pandoc frontend/readme.md \
        -o docs/frontend/readme.pdf \
        --template docs/templates/eisvogel.latex  \
        --standalone \
        --listings \
        --table-of-contents \
        --variable=titlepage \
        --resource-path=frontend
