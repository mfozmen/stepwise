import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(dirname(fileURLToPath(import.meta.url)))

function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw.trim() }

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":")
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    data[key] = value
  }

  return { data, body: match[2].trim() }
}

function readMarkdown(relativePath) {
  return splitFrontmatter(readFileSync(join(root, relativePath), "utf8"))
}

function readCommand(relativePath) {
  const { data, body } = readMarkdown(relativePath)
  return { description: data.description, template: `${body}\n` }
}

function readAgent(relativePath) {
  const { data, body } = readMarkdown(relativePath)
  return {
    mode: "subagent",
    description: data.description,
    prompt: body,
  }
}

export const StepwisePlugin = async () => {
  return {
    config: async (config) => {
      config.command ??= {}
      config.agent ??= {}
      config.skills ??= {}
      config.skills.paths ??= []

      config.command["stepwise"] = readCommand(".opencode/commands/stepwise.md")
      config.command["stepwise-config"] = readCommand(".opencode/commands/stepwise-config.md")
      config.agent["stepwise"] = readAgent(".opencode/agents/stepwise.md")

      const skillPath = join(root, "skills")
      if (!config.skills.paths.includes(skillPath)) {
        config.skills.paths.push(skillPath)
      }
    },
  }
}

export default StepwisePlugin
