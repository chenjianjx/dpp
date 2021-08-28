#!/usr/bin/env node

import { execute } from "./entry";

const args = process.argv.slice(2);

execute(args);

