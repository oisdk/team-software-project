#!/usr/bin/env python3

"""
Pandoc filter to find all relative links to markdown or restructured text files
and change them to point to pdf files with the same path.

This is intended to be used when converting a number of interlinked files to
pdfs, to keep the links intact.
"""

from pandocfilters import toJSONFilter, Link

def relink(key, value, format, meta):
    if key == "Link":
        link_url = value[2][0]
        for ending in ['.md', '.rst']:
            if link_url.endswith(ending):
                link_url = link_url.replace(ending, '.pdf')
        value[2][0] = link_url
        return Link(value[0], value[1], value[2])

if __name__ == '__main__':
    toJSONFilter(relink)
