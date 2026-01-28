from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="environment",
    version="0.1.0",
    description="Environment management utilities",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="bbjjerr",
    author_email="bbjjerr@gmail.com",
    url="https://github.com/bbjjerr/environment",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.8",
    install_requires=[
        # Add runtime dependencies here
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=4.0.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
            "mypy>=1.0.0",
        ],
    },
)
