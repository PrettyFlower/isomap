node ~/Projects/typescriptlinux/built/local/tsc.js @files
mkdir -p Scripts/JS
rsync -a --include "*/" --include "*.js" --exclude "*" --remove-source-files Scripts/TS/. Scripts/JS
