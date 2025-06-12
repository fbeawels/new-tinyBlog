import sys
import os
import pytest

def main():
    print("Starting tests...")
    print(f"Python executable: {sys.executable}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Python path: {sys.path}")
    
    # Add the current directory to the path
    sys.path.insert(0, os.path.abspath('.'))
    
    # Run pytest programmatically
    exit_code = pytest.main([
        "tests/api/test_auth.py",
        "-v",
        "-s"
    ])
    
    print(f"Tests finished with exit code: {exit_code}")
    return exit_code

if __name__ == "__main__":
    sys.exit(main())
