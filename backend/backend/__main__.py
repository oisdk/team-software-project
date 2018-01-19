"""an example"""

def main():
    """serves an example web page

    >>> example()
    Content-Type: text/html
    <BLANKLINE>
    <!DOCTYPE html><html lang="en"><head><title>Example</title></head><body></body></html>
    """
    print('Content-Type: text/html')
    print()
    print('<!DOCTYPE html><html lang="en"><head><title>Example</title></head><body></body></html>')
