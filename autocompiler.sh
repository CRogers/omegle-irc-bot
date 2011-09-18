#!/bin/sh

# See https://github.com/CRogers/FileWatcher

filewatcher "src/" "*.coffee" "coffee -b -o bin/ -c :path" "rm bin/:wefile.js" &
filewatcher "tests/" "*.coffee" "coffee -b -o tests/ -c :path" "rm tests/:wefile.js"
