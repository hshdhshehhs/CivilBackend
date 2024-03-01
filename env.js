export function parseEnvFile(file) {
    const rawText = new XMLHttpRequest().responseText;
    const lines = rawText.trim().split('\n');
    const env = {};
    lines.forEach((line) => {
      const [key, value] = line.split('=');
      env[key] = value;
    });
    return env;
};