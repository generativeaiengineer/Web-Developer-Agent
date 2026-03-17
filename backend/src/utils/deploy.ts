import { execSync } from 'child_process';
import path from 'path';

export interface DeployResult {
  url: string;
  success: boolean;
}

export function deployToSurge(buildDir: string, clientSlug: string): DeployResult {
  const domain = `${clientSlug}-${Date.now()}.surge.sh`;
  const distDir = path.join(buildDir, 'dist');

  try {
    execSync(`npx surge "${distDir}" "${domain}"`, {
      stdio: 'pipe',
      timeout: 60_000,
      env: { ...process.env, SURGE_LOGIN: '', SURGE_TOKEN: '' }, // anonymous deploy
    });
    return { url: `https://${domain}`, success: true };
  } catch {
    return { url: '', success: false };
  }
}
