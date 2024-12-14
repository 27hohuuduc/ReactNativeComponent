#!/usr/bin/env node

import { resolve, join } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'

const ShowWarning = () => {
    console.log("Usage: <name> <path> <-t, --testing>")
}

// Invalid characters
const invalidChars = /[\\\/:*?"<>|]/;
// Valid number of parameters
const validNumberOfParam = new Set([4, 5])
// Create testing flag
const testingFlag = new Set(['-t', '--testing'])

// Check valid name
const isValidName = (name: string) => {
    name = name.trim()

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

const componentContent = 'hello'

const createFile = (dir: string, file: string, content: string) => {
    // Check exists dir 
    if (!existsSync(dir))
        mkdirSync(dir, { recursive: true })

    // Write file
    writeFileSync(join(dir, file), content, 'utf8')
}

try {
    if(validNumberOfParam.has(process.argv.length))
        throw new Error("Don't enough parameter.")

    const name = process.argv[2]
    if (!isValidName(name))
        throw new Error("Name is invalid.")

    const path = resolve(process.argv[3])
    createFile(path, `${name}.component.tsx`, componentContent)
    createFile(path, `${name}.style.ts`, componentContent)
    if (testingFlag.has(process.argv[4]))
        createFile(path, `${name}.test.ts`, componentContent)
    
} catch (err) {
    console.error(err)
    ShowWarning()
}


