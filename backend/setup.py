"""Setup module for the monopoly backend
"""

from setuptools import setup, find_packages

from codecs import open
from os import path

from pages import pages

here = path.abspath(path.dirname(__file__))

with open(path.join(here, 'README.rst'), encoding='utf-8') as f:
    long_description = f.read()


setup(
    name='backend',
    version='0.0.1',
    description='The backend for the monopoly app',
    classifiers=[
        'Programming Language :: Python :: 3.5',
    ],
    packages=find_packages(),
    entry_points={
        'console_scripts': list(map('='.join, pages.items())),
    },
)
