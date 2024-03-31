#! /usr/bin/env bash

/home/jmpc4/dev/multi_process_phobos/bin/Debug/net7.0/multi_process_phobos \
  script \
  --os linux \
  --phobos /home/jmpc4/dev/phobos \
  --source /home/jmpc4/fast_data/phobos_temp/extracted \
  --cache /home/jmpc4/fast_data/phobos_temp/ast_cache \
  --external-scripts /home/jmpc4/dev/jansharp.github.io/scripts \
  --script keybinds_search
