#!/bin/bash

export BASE1=/Volumes/StorageDrive/jmthompson/git/xwing-miniatures-game/src

for filename1 in $(find $BASE1 -name "*.js"); do
    name1=$(basename "$filename1" .js)
    count=$(grep -rl "$name1" --include \*.js --include \*.html $BASE1 | wc -l)
    if [ $count -lt 2 ]; then
        echo ${name1} ${count}
    fi
done
