#!/usr/bin/env python3
"""
Script to extract tests from existing test files and organize them by project type.
"""
import re
import os
from pathlib import Path
from typing import List, Dict, Tuple

# Patterns to identify test categories
AUTH_PATTERN = re.compile(r'should return 401', re.IGNORECASE)
EMPTY_DB_PATTERN = re.compile(r'empty (array|object|dates)|no (runs|snapshots|orders|developers|holidays) exist|uniqueCount 0', re.IGNORECASE)
POSITIVE_PATTERN = re.compile(r'should return (200|201)|should validate|should (create|update|delete|refresh|save|return .* successfully)', re.IGNORECASE)
NEGATIVE_PATTERN = re.compile(r'should return (400|403|404|409|500)', re.IGNORECASE)

# Exclude patterns for positive tests
POSITIVE_EXCLUDE = re.compile(r'should return (400|401|403|404|409|500)|empty (array|object|dates)|no .* exist', re.IGNORECASE)

def categorize_test(test_content: str) -> List[str]:
    """Categorize a test into project types based on its content."""
    categories = []
    
    if AUTH_PATTERN.search(test_content):
        categories.append('auth')
    
    if EMPTY_DB_PATTERN.search(test_content):
        categories.append('empty-db')
    
    if NEGATIVE_PATTERN.search(test_content):
        categories.append('negative')
    
    if POSITIVE_PATTERN.search(test_content) and not POSITIVE_EXCLUDE.search(test_content):
        categories.append('positive')
    
    return categories

def extract_test_blocks(content: str) -> List[Tuple[str, int, int]]:
    """Extract individual test blocks from a file."""
    tests = []
    lines = content.split('\n')
    
    i = 0
    while i < len(lines):
        # Look for test() calls
        if re.match(r'\s*test\(', lines[i]):
            start = i
            # Find the matching closing brace
            brace_count = 0
            in_string = False
            string_char = None
            
            j = i
            while j < len(lines):
                for char in lines[j]:
                    if char in ['"', "'", '`'] and (j == i or lines[j][lines[j].index(char)-1] != '\\'):
                        if not in_string:
                            in_string = True
                            string_char = char
                        elif char == string_char:
                            in_string = False
                            string_char = None
                    
                    if not in_string:
                        if char == '{':
                            brace_count += 1
                        elif char == '}':
                            brace_count -= 1
                            if brace_count == 0:
                                tests.append((content.split('\n')[start:j+1], start, j+1))
                                i = j
                                break
                j += 1
                if brace_count == 0:
                    break
        i += 1
    
    return tests

def process_file(file_path: Path) -> Dict[str, List[str]]:
    """Process a test file and extract tests by category."""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Split into test blocks (simplified - looks for test() calls)
    # This is a simplified parser - may need refinement
    test_blocks = []
    
    # Find all test() calls
    test_pattern = re.compile(r'test\(["\']([^"\']+)["\']')
    matches = list(test_pattern.finditer(content))
    
    categorized = {
        'auth': [],
        'empty-db': [],
        'positive': [],
        'negative': []
    }
    
    # For now, we'll use a simpler approach: extract entire test.describe blocks
    # and categorize based on test names within them
    describe_blocks = re.split(r'(test\.describe\([^)]+\)\s*\{)', content)
    
    return categorized

if __name__ == '__main__':
    print("Test extraction script - manual processing recommended")
    print("This script provides a framework but manual extraction is more reliable")
