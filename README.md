# Dev Utilities

My collection of dev utilities

## Update version

```bash
node ./node_modules/@massimo-cassandro/dev-utils/src/update-version.mjs \     
  --html-files=path/to/html_file1.html,path/to/html_file2.html,... \
  --twig-vars-file=path/to/file/config.html.twig \
  --patch-only \
  --no-descr-prompt \
  --default-descr=text
```
