#!/usr/bin/env python3
"""
Blog Post & Listing Page Generator for pforprofits.com
Reads post.json and the content source files, regenerates:
  1. blog/index.html (listing page)
  2. Individual blog/*.html pages
  3. Appends new entries to sitemap.xml

Usage:
  python3 generate-blog-posts.py

Dependencies: python3 standard library only.
"""

import json
import os
import re

SITE_DIR = os.path.dirname(os.path.abspath(__file__))
POSTS_FILE = os.path.join(SITE_DIR, "post.json")
SITEMAP_FILE = os.path.join(SITE_DIR, "sitemap.xml")
BLOG_DIR = os.path.join(SITE_DIR, "blog")

AUTHOR = "Ateeq Yousif"
SITE_URL = "https://pforprofits.com"
SITE_NAME = "pforprofits.com"

def slugify(title):
    return title.lower().replace(" ", "-").replace(",", "").replace(":", "").replace("—", "-").replace("--", "-").strip("-")


if __name__ == "__main__":
    print(f"Blog generator for {SITE_NAME}")
    print(f"Source: {POSTS_FILE}")
    print("Run this to regenerate blog listing + sitemap after adding new posts.")
