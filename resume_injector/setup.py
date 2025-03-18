# -*- coding: UTF-8 -*-
"""
Setup script for Resume Prompt Injector.
"""

from setuptools import setup

setup(
    name="resume-prompt-injector",
    version="0.1.0",
    description="A tool for injecting invisible prompt text into PDF resumes for research purposes",
    author="Your Name",
    author_email="your.email@example.com",
    py_modules=["resume_injector", "resume_injector_gui", "batch_processor"],  # List modules directly
    install_requires=[
        "reportlab>=3.6.0",
        "PyPDF2>=2.0.0",
        "tqdm>=4.62.0",
    ],
    entry_points={
        "console_scripts": [
            "resume-injector=resume_injector:main",
            "resume-batch=batch_processor:main",
            "resume-gui=resume_injector_gui:main",
        ],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
    python_requires=">=3.7",
)