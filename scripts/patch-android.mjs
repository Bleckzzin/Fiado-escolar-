// Roda depois de "cap add android": assina o APK sempre com a MESMA chave
// (necessário para atualizar o app sem perder os dados) e define a versão.
import fs from 'node:fs';
const f = 'android/app/build.gradle';
let s = fs.readFileSync(f, 'utf8');
if (s.includes('signingConfigs.fiado')) { console.log('build.gradle já ajustado.'); process.exit(0); }
const code = process.env.VERSION_CODE || '1', name = process.env.VERSION_NAME || '1.0';
if (!/versionCode\s+\d+/.test(s) || !/buildTypes\s*\{/.test(s) || !/release\s*\{/.test(s))
  { console.error('Formato inesperado do build.gradle. Veja o LEIAME (seção "Se der erro").'); process.exit(1); }
s = s.replace(/versionCode\s+\d+/, `versionCode ${code}`).replace(/versionName\s+"[^"]*"/, `versionName "${name}"`);
const sign = `signingConfigs {
        fiado {
            storeFile file("../../fiado-release.p12")
            storePassword "fiado2026"
            keyAlias "fiado"
            keyPassword "fiado2026"
            storeType "pkcs12"
        }
    }
    `;
s = s.replace(/buildTypes\s*\{/, sign + 'buildTypes {\n        debug {\n            signingConfig signingConfigs.fiado\n        }');
s = s.replace(/release\s*\{/, 'release {\n            signingConfig signingConfigs.fiado');
fs.writeFileSync(f, s);
console.log(`build.gradle ajustado (versionCode ${code}).`);
