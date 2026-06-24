// Auto-loads translation modules from ./<lang>/<namespace>.ts and merges them
// per language into a single { translation: {...} } object.
const modules = import.meta.glob('./*/*.ts', { eager: true });

const messages: Record<string, { translation: Record<string, string> }> = {};

Object.keys(modules).forEach((path) => {
  const match = path.match(/\.\/([^/]+)\/([^/]+)\.ts$/);
  if (match) {
    const [, lang] = match;
    const module = modules[path] as { default?: Record<string, string> };

    if (!messages[lang]) {
      messages[lang] = { translation: {} };
    }

    // Merge translation entries from each namespace into the language bucket.
    if (module.default) {
      messages[lang].translation = {
        ...messages[lang].translation,
        ...module.default,
      };
    }
  }
});

export default messages;
