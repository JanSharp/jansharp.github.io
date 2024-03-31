#! /usr/bin/env bash

echo "Updating all mods cache"
/home/jmpc4/scripts/update_all_mods_cache

echo "Searching for custom inputs and key sequences"
/home/jmpc4/dev/jansharp.github.io/scripts/keybinds_search.sh \
  > /mnt/big/dev/AllFactorioKeySequencesGist/all_factorio_key_sequences.json

echo "Updating gist"
cd /mnt/big/dev/AllFactorioKeySequencesGist
git add . && git commit --amend --no-edit && git push --force
