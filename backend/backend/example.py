"""an example"""


def example():
    """serves an example web page

    >>> example()
    Content-Type: text/html
    <BLANKLINE>
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Example</title></head>
    <body>this is an example</body>
    </html>
    """
    print("Content-Type: text/html")
    x = 4
    print()
    print("""<!DOCTYPE html>
<html lang="en">
<head><title>Example</title></head>
<body>this is an example</body>
</html>""")
