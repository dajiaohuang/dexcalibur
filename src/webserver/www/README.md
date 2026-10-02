This repository MUST contain the root folder of each UI.

The following tree describes how this folder could be organized:
```
- home/ = The Home UI plugin, downloaded directly from repository CICD [here](https://github.com/reversenseorg/dexcalibur-home)
- pro/ = The Pro UI plugin, can be a symbolic link to your project `cd $HOME/reversenseorg/dxc-ui-reverse && ln -s $PWD/dist/dxc-ui-reverse $HOME/reversenseorg/dexcalibur/src/webserver/www/pro`
- README.md  = This file
```

## Important: Node vs Deno

When you run Reversense through Deno, the executed folder is `src/` instead of `dist/`. In this case, the UI plugins must be installed inside `src/webserver/www`instead of `dist/webserver/www`.     

