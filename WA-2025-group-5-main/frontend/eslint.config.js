import {defineConfig} from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
    {files: ["**/*.{js,mjs,cjs,jsx}"]},
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        languageOptions: {globals: globals.browser}
    },
    js.configs.recommended,

    pluginReact.configs.flat.recommended,
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        rules: {
            'react/react-in-jsx-scope': 'off',

            'react/jsx-uses-react': 'off'
        },

        settings: {
            react: {
                version: 'detect'
            }
        }
    }
]);
