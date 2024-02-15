/* eslint-disable quotes */


export const PackageJsonDefaultOpts = {
  projectName: 'xxx',
  description:  null,
  private: false,
  main: 'index.js',
  module: false,
  issues: false,
  homepage: false,
  react: false
};


export const packageJsonBuilder = opts => {

  opts = {...PackageJsonDefaultOpts, ...opts};

  const repoName = `${opts.private? '' : 'massimo-cassandro/'}${opts.projectName}`;

  return {
    "name": opts.private? opts.projectName : `@massimo-cassandro/${opts.projectName}`,
    "description": opts.description? opts.description : "",
    "version": "0.1.0",
    "author": "Massimo Cassandro",
    ...(opts.private?
      {
        "private": true,
      } : {
        "license": "MIT",
        "publishConfig": {
          "access": "public"
        },
      }
    ),
    ...(opts.main? {"main": opts.main} : {}),
    ...(opts.module? {"type":"module"} : {}),

    "repository": {
      "type": "git",
      "url": `git+https://github.com/${repoName}.git#main`
    },
    ...(opts.issues? {"bugs": {"url": `https://github.com/${repoName}/issues`}} : {}),
    ...(opts.homepage? {"homepage": `https://github.com/${repoName}#readme`} : {}),

    "keywords": [],
    "scripts": {},
    "_scripts": {
      "rollup": "npx rollup --config ./config/rollup.config.mjs --watch",
      "sass+postcss": "npm run sass-cli & npm run postcss-cli",
      "sass-cli": "npx sass ./source/:./target/ --load-path=./node_modules/ --load-path=./front-end/icone/ --style=compressed --watch",
      "postcss-cli": "npx postcss ../public/css/**/*.css --dir ../public/css/ --config ./scripts/ --map --verbose --watch",
      "webpack DEV": "NODE_ENV=development webpack serve --config ./config/webpack-config/webpack.dev.js",
      "build-css-custom-prop-list": "node './scripts/get-css-custom-properties-list.mjs'",
      "build_icons": "cd ./front-end/icone && gulp",

      "build-breakpoints-scss": "node ./scripts/build-scss-breakpoint.mjs --input-type=module",
      "email-css": "npx sass ./front-end/email/:./AppBundle/Resources/views/_email/_tpl --load-path=./node_modules/ --no-source-map --style=compressed --watch",
      "presass": "npm run 'build-breakpoints-scss'",
      "sass-script": "sh ./frontend-src/run-sass.sh",
      "postcss-script": "sh ./frontend-src/postcss/run-postcss.sh",
      "UPD-version": "npx update-version --config=./dev-utilities.config.mjs",
      "upd@m": "npx upd@m",
      "npm update": "npm update",
      "npm publish": "npm publish",
      "local test server": "python3 -m http.server 8000 --directory build",
      "php server": "php -S localhost:8000",

      "webpack PROD": "NODE_ENV=production webpack --config ./config/webpack-config/webpack.prod.js"
    },

    "browserslist": [
      "last 1 version",
      "iOS >= 13",
      "Safari >= 12",
      "not ie <= 11",
      "> 3% in IT"
    ],
    "stylelint": {
      "extends": "@massimo-cassandro/linters-config/stylelintrc.js",
      "ignoreFiles": ["**/*.css"]
    },
    "eslintConfig": {
      "extends": [
        ...(opts.react? ["react-app"] : []),
        "./node_modules/@massimo-cassandro/linters-config/eslintrc.js"
      ],
      "ignorePatterns": []
    },
    "babel": {
      "presets": [
        "@babel/preset-env",
        ...(opts.react? [[
          "@babel/preset-react",
          {
            "runtime": "automatic"
          }
        ]] : []),
      ],
      "plugins": [
        "@babel/plugin-proposal-class-properties"
      ]
    },
    "files": [],
    "dependencies": {},
    "devDependencies": {}
  };
};

