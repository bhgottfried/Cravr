"""Setup file used for Dependabot"""

from setuptools import setup

setup(
    name='Cravr',
    version='1.0',
    long_description=__doc__,
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'flask',
        'flask-cors',
        'python-dotenv'
    ]
)
