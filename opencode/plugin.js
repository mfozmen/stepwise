import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(dirname(fileURLToPath(import.meta.url)))

function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw.trim() }

  const parseYaml = globalThis.Bun?.YAML?.parse
  if (typeof parseYaml !== "function") {
    throw new Error("Stepwise needs Bun's YAML parser to read plugin frontmatter")
  }

  const data = parseYaml(match[1]) ?? {}
  if (typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Stepwise plugin frontmatter must be a YAML mapping")
  }

  return { data, body: match[2].trim() }
}

function readMarkdown(relativePath) {
  return splitFrontmatter(readFileSync(join(root, relativePath), "utf8"))
}

function readCommand(relativePath) {
  const { data, body } = readMarkdown(relativePath)
  return { ...data, template: `${body}\n` }
}

function readAgent(relativePath) {
  const { data, body } = readMarkdown(relativePath)
  return { ...data, mode: data.mode ?? "subagent", prompt: body }
}

export const StepwisePlugin = async () => {
  return {
    config: async (config) => {
      config.command ??= {}
      config.agent ??= {}
      config.skills ??= {}
      config.skills.paths ??= []

      config.command["stepwise"] ??= readCommand(".opencode/commands/stepwise.md")
      config.command["stepwise-config"] ??= readCommand(".opencode/commands/stepwise-config.md")
      config.agent["stepwise"] ??= readAgent(".opencode/agents/stepwise.md")

      const skillPath = join(root, "skills")
      if (!config.skills.paths.includes(skillPath)) {
        config.skills.paths.push(skillPath)
      }
    },
  }
}

export default StepwisePlugin
