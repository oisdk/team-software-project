"""an example"""

import dateutil.parser

def example():
    """serves an example web page

    >>> example()
    Content-Type: text/html
    <BLANKLINE>
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Example</title></head>
    <body>this is an example: 2003-10-11</body>
    </html>
    """
    now = dateutil.parser.parse("Sat Oct 11 17:13:46 UTC 2003")
    today = now.date()
    print('Content-Type: text/html')
    print()
    print("""<!DOCTYPE html>
<html lang="en">
<head><title>Example</title></head>
<body>this is an example: %s</body>
</html>""" % today)
