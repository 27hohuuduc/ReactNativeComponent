#!/usr/bin/env node

import { resolve, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const ShowWarning = () => {
    console.log("Usage: <name> <path> <-t, --testing>");
}

// Invalid characters
const invalidChars = /[\\\/:*?"<>|]/;
// Valid number of parameters
const validNumberOfParam = new Set([4, 5]);
// Create testing flag
const testingFlag = new Set(['-t', '--testing']);

// Check valid name
const isValidName = (name: string) => {
    name = name.trim();

    // Check max length
    if (name.length === 0 || name.length > 90) {
        return false;
    }

    // Check invalid char
    if (invalidChars.test(name)) {
        return false;
    }

    return true;
}

const componentContent = "import React from 'react';\nimport type { PropsWithChildren } from 'react';\nimport { View } from 'react-native';\nimport @NAME@Styles from './@name@.styles';\n\ntype @NAME@Props = PropsWithChildren<{\n    // change this\n}>;\n\nfunction @NAME@({ children }: @NAME@Props): React.JSX.Element {\n    return (\n        <View style={@NAME@Styles.view}>\n            {children}\n        </View>\n    );\n}\n\nexport default @NAME@;\n";
const stylesContent = "import { StyleSheet } from 'react-native';\n\nconst @NAME@Styles = StyleSheet.create({\n    view: {\n        // change this\n    },\n});\n\nexport default @NAME@Styles;\n"
const testContent = "import React from 'react';\nimport { describe, it } from '@jest/globals';\nimport { render } from '@testing-library/react-native';\nimport @NAME@ from './@name@.component';\n\ndescribe('@NAME@Component', () => {\n    it('renders correctly', () => {\n        render(<@NAME@ />);\n    });\n});\n"

const createFile = (dir: string, file: string, content: string) => {
    // Check exists dir 
    if (!existsSync(dir))
        mkdirSync(dir, { recursive: true });

    // Write file
    writeFileSync(join(dir, file), content, 'utf8');
}

const replaceName = (content: string, capitalizename: string, name: string) => {
    return content
        .replace(/@NAME@/g, capitalizename)
        .replace(/@name@/g, name);
}

try {
    if (!validNumberOfParam.has(process.argv.length))
        throw new Error("Don't enough parameter.");

    const name = process.argv[2].toLowerCase();
    if (!isValidName(name))
        throw new Error("Name is invalid.");
    const capitalizeName = name.charAt(0).toUpperCase() + name.slice(1);

    const path = join(resolve(process.argv[3]), capitalizeName);
    // Create component
    createFile(path, `${name}.component.tsx`, replaceName(componentContent, capitalizeName, name));
    // Create styles
    createFile(path, `${name}.style.ts`, replaceName(stylesContent, capitalizeName, name));
    // Create testing if necessary
    if (testingFlag.has(process.argv[4]))
        createFile(path, `${name}.test.ts`, replaceName(testContent, capitalizeName, name));

} catch (err) {
    console.error(err);
    ShowWarning();
}


